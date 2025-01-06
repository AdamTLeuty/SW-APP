package main

import (
	"database/sql"
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type Dentist struct {
	ID           int    `json:"id"`
	JarvisID     int    `json:"dentist_user"` // Mapping dentist_user to jarvisID
	Name         string `json:"name"`
	StreetNumber string `json:"address.street_number"`
	Street       string `json:"address.street"`
	City         string `json:"address.city"`
	Region       string `json:"address.region"`
	Country      string `json:"address.country"`
	Postcode     string `json:"postcode"`
}

func updateDentistData(db *sql.DB, id int) error {
	//Get the most up-to-date information from Jarvis
	data, err := jarvis_get_dentist_data(id)
	if err != nil {
		log.Println(err)
		return err
	}

	//Perform an upsert on the data
	stmt, err := db.Prepare(`
		INSERT INTO dentists (jarvisID, name, street_number, street, city, region, country, postcode)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?)
		ON CONFLICT (jarvisID)
		DO UPDATE SET
		    name = excluded.name,
		    street_number = excluded.street_number,
		    street = excluded.street,
		    city = excluded.city,
		    region = excluded.region,
		    country = excluded.country,
		    postcode = excluded.postcode;
		`)
	if err != nil {
		return err
	}

	_, err = stmt.Exec(data.JarvisID, data.Name, data.StreetNumber, data.Street, data.City, data.Region, data.Country, data.Postcode)
	if err != nil {
		return err
	}
	return nil
}

func getDentistData(c *gin.Context, db *sql.DB) {

	dentistID, err := strconv.Atoi(c.Param("dentistid"))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching dentist data - please try again later"})
		return
	}

	//First, check dentist exists
	var dentistInDB bool

	err = db.QueryRow(`SELECT EXISTS(SELECT 1 FROM dentists WHERE jarvisID = ?)`, dentistID).Scan(&dentistInDB)
	if err != nil {
		log.Println("Error checking dentist in db: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching dentist data - please try again later"})
		return
	}

	//If not, fetch from Jarvis
	if !dentistInDB {
		log.Println("No dentist in the database!")
		err = updateDentistData(db, dentistID)
		if err != nil {
			log.Println(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching dentist data - please try again later"})
			return
		}
	}

	var dentist Dentist

	err = db.QueryRow(`SELECT
							name,
							street_number,
							street,
							city,
							region,
							country,
							postcode
						FROM dentists
						WHERE jarvisID = ?
	`, dentistID).Scan(&dentist.Name, &dentist.StreetNumber, &dentist.Street, &dentist.City, &dentist.Region, &dentist.Country, &dentist.Postcode)
	if err != nil {
		log.Println("Error scanning for dentist data: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching dentist data - please try again later"})
		return
	}
	log.Println(dentist)

	c.JSON(http.StatusOK, gin.H{"message": "Dentist data fetched", "dentist": dentist})
	return
}

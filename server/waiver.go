package main

import (
	"database/sql"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func signWaiver(c *gin.Context, db *sql.DB) {

	email := c.GetString("email")

	//Check if user exists in database
	emailInDB, err := checkEmailExists(db, email)
	if err != nil {
		log.Println("Cannot verify user,'", email, "' exists: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Please try again later"})
		return
	}
	if !emailInDB {
		log.Println("Cannot verify user,'", email, "' exists: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Please try again later"})
		return
	}

	tx, err := db.Begin()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Please try again later"})
		log.Println("Could not start transaction: ", err)
		return
	}
	// Defer a rollback in case anything fails.
	defer tx.Rollback()

	stmt, err := tx.Prepare(`UPDATE users SET medical_waiver_signed = 1 WHERE email = ?`)
	if err != nil {
		tx.Rollback()
		log.Println("Could not prepare update of `users` table: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Please try again later"})
		return
	}

	_, err = stmt.Exec(email)
	if err != nil {
		tx.Rollback()
		log.Println("Could not prepare update of `users` table: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Please try again later"})
		return
	}

	err = jarvis_sign_medical_waiver(email)
	if err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Please try again later"})
		return
	}

	err = tx.Commit()
	if err != nil {
		log.Println("Could not commit transaction: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Please try again later"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Medical waiver signed successfully"})
}

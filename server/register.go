package main

import (
	"database/sql"
	"fmt"
	"time"

	"net/http"

	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
)

func register(c *gin.Context, db *sql.DB) {

	var user User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if user.Email == "" || user.Password == "" {

		c.JSON(http.StatusUnauthorized, gin.H{"error": "Email and Password cannot be blank"})
		return

	}

	emailInDB, err := checkEmailExists(db, user.Email)

	if emailInDB {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Contact already exists with that email within the database - please login or reset your password"})
		fmt.Println("The email is in the database already")
		return
	}

	userInHubspot := emailInHubspot(user.Email)

	if !userInHubspot {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Please use the email you used for your consultation"})
		fmt.Println("The email is not present in HubSpot :(")
		return
	}

	fmt.Println("Email and Password Below:")
	fmt.Println(user.Email)
	fmt.Println(user.Password)

	hashedPassword, err := hashPassword(user.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	//Generate an authcode
	authCode := generateAuthCode()

	unixEpoch := time.Unix(0, 0).UTC()

	// Get a Tx for making transaction requests.
	tx, err := db.Begin()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		fmt.Println("Could not start transaction: ", err)
		return
	}
	// Defer a rollback in case anything fails.
	defer tx.Rollback()

	stmt, err := tx.Prepare("INSERT INTO users(email, password, username, verified, authcode, stage, impressionConfirmation, alignerProgress, alignerCount, alignerChangeDate, expo_notification_token ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)")
	if err != nil {
		tx.Rollback()
		fmt.Println("Could not prepare insert into `users` table: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to prepare database statement"})
		return
	}
	res, err := stmt.Exec(user.Email, hashedPassword, user.Username, false, authCode, "impression", "unset", 0, 0, unixEpoch.Format(time.RFC3339), "")
	if err != nil {
		tx.Rollback()
		fmt.Println("Could not execute insert into `users` table: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to execute database statement"})
		return
	}

	// Get the last inserted user ID
	userID, err := res.LastInsertId()
	if err != nil {
		tx.Rollback()
		fmt.Println("Could not get last inserted ID from `users` table: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve user ID"})
		return
	}

	//This is ugly temporary code
	//userID, processStage, objectID := 1, "testStage", 12345

	hubspotData, err := getUserHubspotData("test@gmail.com")
	if err != nil {
		fmt.Println("Error: ", err)
		c.Status(http.StatusInternalServerError)
		return
	}

	objectID := hubspotData.ObjectID
	processStage := hubspotData.Process_Stage

	stmt, err = tx.Prepare("INSERT INTO user_hubspot_data(userID, process_stage, object_id ) VALUES(?, ?, ?)")
	if err != nil {
		tx.Rollback()
		fmt.Println("Could not prepare insert into Hubspot table: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to prepare database statement"})
		return
	}
	_, err = stmt.Exec(userID, processStage, objectID)
	if err != nil {
		tx.Rollback()
		fmt.Println("Could not execute insert into Hubspot table: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to execute database statement"})
		return
	}

	err = tx.Commit()
	if err != nil {
		fmt.Println("Could not commit transaction: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to execute database statement"})
		return
	}

	token, err := createToken(user.Email)

	c.JSON(http.StatusOK, gin.H{"message": "User registered successfully", "token": token})

	go sendEmail(user.Email, authCode)

}

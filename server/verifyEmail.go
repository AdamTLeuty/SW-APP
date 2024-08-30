package main

import (
	"database/sql"
	"fmt"
	"log"
	"strconv"

	"net/http"

	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
)

type VerificationData struct {
	Email    string `json:"email"`
	AuthCode string `json:"authcode"`
}

func verifyEmail(c *gin.Context, db *sql.DB) {

	//Read the request data
	var verifyData VerificationData
	if err := c.ShouldBindJSON(&verifyData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	fmt.Println("Email:", verifyData.Email)
	fmt.Println("Authcode:", verifyData.AuthCode)

	//Check the request contained data
	if verifyData.Email == "" || verifyData.AuthCode == "" {

		c.JSON(http.StatusUnauthorized, gin.H{"error": "Must provide an email and auth code"})
		return

	}

	//Check if user exists in database
	emailInDB, err := checkEmailExists(db, verifyData.Email)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Failed to check whether email is in the database"})
	}
	if !emailInDB {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Cannot verify email not in database"})
		return
	}

	//Check if user is already verified
	//Find the authcode for the given user
	row, err := db.Query("SELECT verified FROM users WHERE email = ?", verifyData.Email)
	if err != nil {
		log.Fatal(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not find authcode in database"})
		return
	}
	defer row.Close()
	row.Next()
	var verified bool
	readErr := row.Scan(&verified)
	if readErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "DB Read Error"})
		log.Fatal(readErr)
		return
	}

	if verified {
		//The user's email is already verified
		c.JSON(http.StatusConflict, gin.H{"error": "User already verified"})
		return
	}

	row.Close()

	//Find the authcode for the given user
	row, err = db.Query("SELECT authcode FROM users WHERE email = ?", verifyData.Email)
	if err != nil {
		log.Fatal(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not find authcode in database"})
		return
	}
	defer row.Close()
	row.Next()
	var authcode int
	readErr = row.Scan(&authcode)
	if readErr != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "DB Read Error"})
		log.Fatal(readErr)
		return
	}
	fmt.Println("Authcode from the database is : ", authcode)
	row.Close()

	//Check the authcodes match
	if strconv.Itoa(authcode) == verifyData.AuthCode {
		fmt.Println("The auth codes match")
		c.JSON(http.StatusOK, gin.H{"message": "Accessed the email confirmation endpoint"})
		setUserEmailVerified(db, verifyData.Email)
	} else {
		fmt.Println("The auth codes do not match")
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Incorrect Auth Code"})
	}
}

func setUserEmailVerified(db *sql.DB, email string) {
	fmt.Println("Setting the user to verified")
	//Set the `verified` flag field in the users database to true for a given user

	stmt, err := db.Prepare("UPDATE users SET verified = '1' WHERE email = ?")
	if err != nil {
		fmt.Println("database failed: ", err)
		return
	}
	_, err = stmt.Exec(email)
	if err != nil {
		fmt.Println("execution failed: ", err)
		return
	}
}

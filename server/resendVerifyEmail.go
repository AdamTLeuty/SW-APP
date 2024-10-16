package main

import (
	"database/sql"
	"log"

	"net/http"

	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
)

type EmailResendData struct {
	Email string `json:"email"`
}

func resendVerifyEmail(c *gin.Context, db *sql.DB) {

	//Read the request data
	var emailResendData EmailResendData
	if err := c.ShouldBindJSON(&emailResendData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	//Check the request contained data
	if emailResendData.Email == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Must provide an email and auth code"})
		return
	}

	//Check if user exists in database
	emailInDB, err := checkEmailExists(db, emailResendData.Email)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Failed to check whether email is in the database"})
	}
	if !emailInDB {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Cannot verify email not in database"})
		return
	}

	//Check if user is already verified
	verified, err := checkUserEmailVerified(db, emailResendData.Email)
	if err != nil {
		log.Fatal(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not verify user"})
		return
	}
	if verified {
		//The user's email is already verified
		c.JSON(http.StatusConflict, gin.H{"error": "User already verified"})
		return
	}

	//Generate a new authcode for the user
	authCode := generateAuthCode()

	//Set the user's authcode to the newly generated one
	err = updateUserAuthCode(db, emailResendData.Email, authCode)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not generate a new authorisation code, please try again later"})
	}

	//Send the email to the user
	err = sendEmail(emailResendData.Email, authCode)

	if err != nil {
		//Error if email not sent
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not send verification email, please try again later"})
	} else {
		//Success if sent
		c.JSON(http.StatusOK, gin.H{"message": "Resent verification email"})
	}
}

func updateUserAuthCode(db *sql.DB, email string, authcode string) error {
	//Changing the user's authcode
	stmt, err := db.Prepare("UPDATE users SET authcode = ? WHERE email = ?")
	if err != nil {
		log.Println("database failed: ", err)
		return err
	}
	_, err = stmt.Exec(authcode, email)
	if err != nil {
		log.Println("execution failed: ", err)
		return err
	}

	return nil
}

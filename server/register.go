package main

import (
	"database/sql"
	"fmt"

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

	if emailInHubspot(user.Email) != true {

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

	stmt, err := db.Prepare("INSERT INTO users(email, password, verified, authcode) VALUES(?, ?, ?, ?)")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to prepare database statement"})
		return
	}
	_, err = stmt.Exec(user.Email, hashedPassword, false, authCode)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to execute database statement"})
		return
	}

	token, err := createToken(user.Email)

	c.JSON(http.StatusOK, gin.H{"message": "User registered successfully", "token": token})

	sendEmail(user.Email, authCode)

}

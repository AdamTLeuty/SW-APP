package main

import (
	"database/sql"
	"log"
	"strings"
	"time"

	"net/http"

	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
)

func login(c *gin.Context, db *sql.DB) {
	var loginDetails User
	if err := c.ShouldBindJSON(&loginDetails); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	start := time.Now() // Record start time
	var user User
	err := db.QueryRow("SELECT id, email, password FROM users WHERE email = ?", loginDetails.Email).Scan(&user.ID, &user.Email, &user.Password)
	duration := time.Since(start) // Calculate the duration
	log.Printf("Duration of database read is %s\n", duration)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		log.Println(err)
		return
	}

	if !checkPasswordHash(loginDetails.Password, user.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	verified, err := checkUserEmailVerified(db, loginDetails.Email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "There has been an issue verifying your email. Please try again, or contact support"})
		log.Println(err)
		return
	}
	if !verified {
		c.JSON(http.StatusForbidden, gin.H{"error": "Your email has not yet been verified"})
		return
	}

	token, err := createToken(loginDetails.Email)

	c.JSON(http.StatusOK, gin.H{"message": "Logged in successfully", "token": token})
}

type tokenLoginDetails struct {
	Email string `json:"email"`
}

type Header struct {
	Authorization string `header:"Authorization" binding:"required"`
}

func loginWithToken(c *gin.Context, db *sql.DB) {

	var h Header
	if err := c.BindHeader(&h); err != nil {
		log.Println(err)
		return
	}

	log.Println(h.Authorization)
	token := strings.Replace(h.Authorization, "Bearer ", "", 1)
	log.Println("Token", token)
	log.Println(token)

	var tokenLoginDetails tokenLoginDetails
	if err := c.ShouldBindJSON(&tokenLoginDetails); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	claimValue, err := verifyToken(token)
	if err != nil {
		log.Printf("Error: %v\n", err)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Token has expired, please login again"})
		return
	} else {
		log.Printf("Claim value: %v\n", claimValue)
	}
	log.Println("The decoded claim is: ", claimValue)
	log.Println("The error from the token verification is: ", err)

	emailInDB, err := checkEmailExists(db, claimValue.(string))

	if !emailInDB {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User does not exist"})
		return
	}

	verified, err := checkUserEmailVerified(db, claimValue.(string))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "There has been an issue verifying your email. Please try again, or contact support"})
		log.Println(err)
		return
	}
	if !verified {
		c.JSON(http.StatusForbidden, gin.H{"error": "Your email has not yet been verified", "email": claimValue.(string)})
		return
	}

	token, err = createToken(claimValue.(string))
	log.Println(claimValue.(string))

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error - please try again later"})
		return
	}

	if err != nil {

		c.JSON(http.StatusUnauthorized, gin.H{"error": err})

	} else {

		c.JSON(http.StatusOK, gin.H{"message": "Logged in successfully", "email": claimValue, "token": token})

	}

}

func checkUserEmailVerified(db *sql.DB, email string) (bool, error) {

	//Check if user is verified
	//Find the authcode for the given user
	row, err := db.Query("SELECT verified FROM users WHERE email = ?", email)
	if err != nil {
		return false, err
	}
	defer row.Close()
	row.Next()
	var verified bool
	readErr := row.Scan(&verified)
	if readErr != nil {
		return false, readErr
	}

	return verified, err

}

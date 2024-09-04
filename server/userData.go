package main

import (
	"database/sql"
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

type UserDataRequest struct {
	Stage    string `json:"stage,omitempty"`
	Username string `json:"username,omitempty"`
}

type UserDataResponse struct {
	Stage    string `json:"stage,omitempty"`
	Username string `json"stage,omitempty"`
}

func getUserData(c *gin.Context, db *sql.DB) {

	var h Header
	if err := c.BindHeader(&h); err != nil {
		fmt.Println(err)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Must provide Bearer header with authorisation token"})
		return
	}
	if h.Authorization == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Must provide Bearer header with authorisation token"})
		return
	}

	token := strings.Replace(h.Authorization, "Bearer ", "", 1)

	//Check the request contained data
	if token == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Must provide an email and login token"})
		return
	}

	//Check that the token corresponds to the email provided
	tokenEmail, err := verifyToken(token)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Must provide an email and login token"})
	}
	var email = tokenEmail.(string)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error - please try again later"})
		return
	}

	//Check if user exists in database
	emailInDB, err := checkEmailExists(db, email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Cannot verify user exists - please try again later"})
		return
	}
	if !emailInDB {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Cannot get user data - no such user exists"})
		return
	}

	var userData UserDataResponse

	err = db.QueryRow("SELECT stage, username FROM users WHERE email = ?", email).Scan(&userData.Stage, &userData.Username)
	if err != nil {
		fmt.Println("Error scanning for user data: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching user data - please try again later"})
		return
	}

	fmt.Println(userData)

	c.JSON(http.StatusOK, gin.H{"message": "User data fetched", "userData": userData})
}

func setUserData(c *gin.Context, db *sql.DB) {

	var h Header
	if err := c.BindHeader(&h); err != nil {
		fmt.Println(err)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Must provide Bearer header with authorisation token"})
		return
	}
	if h.Authorization == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Must provide Bearer header with authorisation token"})
		return
	}

	token := strings.Replace(h.Authorization, "Bearer ", "", 1)

	//Check the request contained data
	if token == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Must provide an email and login token"})
		return
	}

	//Check that the token corresponds to the email provided
	tokenEmail, err := verifyToken(token)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Must provide an email and login token"})
	}
	email := tokenEmail.(string)

	//Read the request data
	var requestData UserDataRequest
	if err := c.ShouldBindJSON(&requestData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	//Check if user exists in database
	emailInDB, err := checkEmailExists(db, email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Cannot verify user exists - please try again later"})
		return
	}
	if !emailInDB {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Cannot set user data - no such user exists"})
		return
	}

	err = updateUserData(db, email, requestData)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err})
	} else {
		c.JSON(http.StatusOK, gin.H{"message": "User data updated"})
	}

}

func updateUserData(db *sql.DB, email string, request UserDataRequest) error {
	//Updates user data based on which members of request are populated
	fmt.Println("\n Updating user data function")

	var (
		args      []any
		setString = "SET "
	)

	fields := map[string]string{
		"stage":    request.Stage,
		"username": request.Username,
	}

	for field, value := range fields {
		if value != "" {
			if len(args) > 0 {
				setString += ", "
			}
			setString += field + " = ?"
			args = append(args, value)
		}
	}

	fmt.Println(request)

	//Join the SET clause into the query
	query := fmt.Sprintf("UPDATE users %s WHERE email = ?", setString)
	fmt.Println("The final query is: ", query)

	stmt, err := db.Prepare(query)
	if err != nil {
		fmt.Println("database failed: ", err)
		return err
	}

	args = append(args, email)

	fmt.Println(args...)

	_, err = stmt.Exec(args...)
	if err != nil {
		fmt.Println("execution failed: ", err)
		return err
	}
	return nil

}

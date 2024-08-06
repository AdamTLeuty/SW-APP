package main

import (
	"database/sql"
	"fmt"
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
	fmt.Printf("Duration of database read is %s\n", duration)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	if !checkPasswordHash(loginDetails.Password, user.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	token, err := createToken(loginDetails.Email)

	c.JSON(http.StatusOK, gin.H{"message": "Logged in successfully", "token": token})
}

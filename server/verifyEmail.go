package main

import (
	"database/sql"

	"net/http"

	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
)

func verify_email(c *gin.Context, db *sql.DB) {

	c.JSON(http.StatusOK, gin.H{"message": "Accessed the email confirmation endpoint"})

}

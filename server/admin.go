package main

import (
	"database/sql"

	"net/http"

	"github.com/gin-gonic/gin"
)

func admin_login(c *gin.Context, db *sql.DB) {

	c.HTML(http.StatusOK, "login.html", gin.H{
		"Title":   "Basic HTML Page",
		"Message": "Welcome to the Gin framework!",
	})

	return

}

func admin_home(c *gin.Context, db *sql.DB) {

	c.HTML(http.StatusOK, "tables.html", gin.H{
		"Title":   "Basic HTML Page",
		"Message": "Welcome to the Gin framework!",
	})

	return
}

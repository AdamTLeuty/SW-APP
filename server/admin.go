package main

import (
	"database/sql"
	"log"

	"net/http"

	"github.com/gin-gonic/gin"
)

func admin_login(c *gin.Context, db *sql.DB) {

	c.HTML(http.StatusOK, "login.html", gin.H{
		"Username": "Testy McTest",
		"Email":    "test@gmail.com",
	})

	return

}

type TabledUser struct {
	Username string
	Email    string
	Stage    string
	Verified int
}

func admin_home(c *gin.Context, db *sql.DB) {

	//a := []TabledUser{{Username: "Guy", Email: "guy@example.com", Stage: "impression", Verified: 0}, {Username: "Other Guy", Email: "otherGuy@example.com", Stage: "aligner", Verified: 1}, {Username: "Other Guy", Email: "otherGuy@example.com", Stage: "aligner", Verified: 1}}

	rows, err := db.Query("SELECT email, username, verified, stage FROM users")
	if err != nil {
		log.Fatal(err)
		return
	}
	defer rows.Close()

	// An userum slice to hold data from returned rows.
	var users []TabledUser

	// Loop through rows, using Scan to assign column data to struct fields.
	for rows.Next() {
		var user TabledUser
		if err := rows.Scan(&user.Email, &user.Username, &user.Verified,
			&user.Stage); err != nil {
			return
		}
		users = append(users, user)
	}
	if err = rows.Err(); err != nil {
		return
	}

	c.HTML(http.StatusOK, "tables.html", gin.H{
		"Username": "Testy McTest",
		"Email":    "test@gmail.com",
		"List":     users,
	})

	return
}

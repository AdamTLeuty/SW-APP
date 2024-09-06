package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

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

	cookie, err := c.Cookie("session_id")

	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Please log in"})
		return
	}

	fmt.Printf("Cookie value: %s \n", cookie)

	username, err := verifyToken(cookie)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Please log in"})
		return
	}

	fmt.Println(username)

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

type Admin struct {
	Username string
	Password string
}

func admin_login_form(c *gin.Context, db *sql.DB) {

	/*var loginDetails Admin
	if err := c.ShouldBindJSON(&loginDetails); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var admin Admin
	err := db.QueryRow("SELECT id, email, password FROM users WHERE email = ?", loginDetails.Username).Scan(&admin.Username, &admin.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	if loginDetails.Password != admin.Password {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	token, err := createToken(loginDetails.Username)
	if err != nil {

		c.JSON(http.StatusInternalServerError, gin.H{})

		}*/

	username := c.PostForm("username")
	password := c.PostForm("pass")

	fmt.Println(username, " , ", password)

	var admin Admin
	err := db.QueryRow("SELECT  username, password FROM admins WHERE username = ?", username).Scan(&admin.Username, &admin.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	fmt.Println(admin)

	if admin.Password != password {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	token, err := createToken(username)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{})
	}

	//c.JSON(http.StatusOK, gin.H{"message": "Logged in successfully"})
	c.SetCookie("session_id", token, 3600, "/", os.Getenv("DOMAIN"), false, true)
	c.Redirect(302, "/admin/home")
	return

}

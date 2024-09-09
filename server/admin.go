package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"

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
	ID                int
	Username          string
	Email             string
	Stage             string
	Verified          int
	ImpressionQuality string
}

func admin_home(c *gin.Context, db *sql.DB) {

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

	rows, err := db.Query("SELECT id, email, username, verified, stage FROM users")
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
		if err := rows.Scan(&user.ID, &user.Email, &user.Username, &user.Verified,
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

type Image struct {
	Path      string
	ImageType string
}

func admin_user_profile(c *gin.Context, db *sql.DB) {

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

	userPath := c.Param("userid")
	userPath = strings.Replace(userPath, "/", "", -1)
	id, err := strconv.Atoi(userPath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Server error"})
	}

	fmt.Println("the id is:", id)

	var user TabledUser
	err = db.QueryRow("SELECT id, username, stage, email, verified, impressionConfirmation FROM users WHERE id = ?", id).Scan(&user.ID, &user.Username, &user.Stage, &user.Email, &user.Verified, &user.ImpressionQuality)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Server error"})
		fmt.Println("Database broken")
		fmt.Println(err)
		return
	}

	rows, err := db.Query("SELECT imageType, path FROM images WHERE userID = ?", id)
	if err != nil {
		log.Fatal(err)
		return
	}
	defer rows.Close()

	// An userum slice to hold data from returned rows.
	var images []Image

	// Loop through rows, using Scan to assign column data to struct fields.
	for rows.Next() {
		fmt.Println("Adding new image to array")
		var image Image
		if err := rows.Scan(&image.ImageType, &image.Path); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Server error"})
			return
		}
		if image.ImageType == "impression" {
			images = append(images, image)
		}
	}
	if err = rows.Err(); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Server error"})
		return
	}

	fmt.Println(user)

	fmt.Println(images)

	c.HTML(http.StatusOK, "profile.html", gin.H{
		"User":   user,
		"Images": images,
	})
	return

}

func edit_user_impression_state(c *gin.Context, db *sql.DB) {

	userPath := c.Param("userid")
	userPath = strings.Replace(userPath, "/", "", -1)
	id, err := strconv.Atoi(userPath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Server error"})
	}

	fmt.Println("the id is:", id)

	quality := c.PostForm("impressionQuality")

	fmt.Println(quality)

	if quality != "acceptable" && quality != "unacceptable" && quality != "unset" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Impression can only be `unset`, `acceptable` or `unacceptable`"})
		return
	}

	stmt, err := db.Prepare("UPDATE users SET impressionConfirmation = ? WHERE id = ?")
	if err != nil {
		fmt.Println("database failed: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Server Error"})
		return
	}
	if quality == "null" {
		var null sql.NullString
		_, err = stmt.Exec(null, id)
	} else {
		_, err = stmt.Exec(quality, id)
	}
	if err != nil {
		fmt.Println("execution failed: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Server Error"})
		return
	}

	returnAddress := "/admin/user/" + strconv.Itoa(id)

	c.Redirect(302, returnAddress)
	return

}

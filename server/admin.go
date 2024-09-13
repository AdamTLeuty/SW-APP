package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"
	"time"

	"net/http"
	"net/mail"

	"github.com/gin-gonic/gin"
)

type Image struct {
	Path      string
	ImageType string
}

type TabledUser struct {
	ID                             int
	Username                       string
	Email                          string
	Stage                          string
	Verified                       int
	ImpressionQuality              string
	AlignerProgress                int
	AlignerCount                   int
	AlignerChangeDate              string
	AlignerChangeDateHumanReadable string
}

type Admin struct {
	Username string
	Password string
}

func admin_login(c *gin.Context, db *sql.DB) {

	c.HTML(http.StatusOK, "login.html", gin.H{
		"Username": "Testy McTest",
		"Email":    "test@gmail.com",
	})

	return

}

func admin_login_form(c *gin.Context, db *sql.DB) {

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

	user, err := getTabledUserFromID(db, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error, please try again later"})
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

func admin_get_user_info_form(c *gin.Context, db *sql.DB) {

	userPath := c.Param("userid")
	userPath = strings.Replace(userPath, "/", "", -1)
	id, err := strconv.Atoi(userPath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Server error"})
	}

	user, err := getTabledUserFromID(db, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal Server Error, please try again later"})
		return
	}

	c.HTML(http.StatusOK, "userInfoForm.html", gin.H{
		"User": user,
	})
	return

}

func admin_edit_user_info_form(c *gin.Context, db *sql.DB) {

	userPath := c.Param("userid")
	userPath = strings.Replace(userPath, "/", "", -1)
	id, err := strconv.Atoi(userPath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Server error"})
		return
	}

	email := c.PostForm("email")
	var verified int
	if c.PostForm("verified") != "" {
		verified, err = strconv.Atoi(c.PostForm("verified"))

		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid `email verified` value"})
			return
		}
	} else {
		verified = 0
	}
	username := c.PostForm("username")
	stage := c.PostForm("stage")
	aligner_progress := c.PostForm("aligner-progress")
	aligner_count := c.PostForm("aligner-count")
	aligner_change_date := c.PostForm("aligner-change-date")

	fmt.Printf("\nUsername: %s\n Email: %s\n Verified: %s\n Stage: %s\n Progress: %s\n Count: %s\n Change Date: %s\n\n", username, email, strconv.Itoa(verified), stage, aligner_progress, aligner_count, aligner_change_date)

	_, err = mail.ParseAddress(email)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Email"})
		return
	}

	// parse string date to golang time
	date, err := time.Parse("2006-01-02", aligner_change_date)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err, "message": "Date Invalid"})
		return
	}
	newDate := date.Format(time.RFC3339)

	stmt, err := db.Prepare("UPDATE users SET email = ?, username= ?, verified= ?, stage= ?,  alignerProgress= ?, alignerCount= ?, alignerChangeDate= ? WHERE id = ?")
	if err != nil {
		fmt.Println("database failed: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Server Error"})
		return
	}

	_, err = stmt.Exec(email, username, verified, stage, aligner_progress, aligner_count, newDate, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	url := "/admin/user/" + strconv.Itoa(id)
	c.Redirect(302, url)
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

func getTabledUserFromID(db *sql.DB, id int) (TabledUser, error) {

	var user TabledUser
	var dateString string
	err := db.QueryRow("SELECT id, username, stage, email, verified, impressionConfirmation, alignerProgress, alignerCount, alignerChangeDate FROM users WHERE id = ?", id).Scan(&user.ID, &user.Username, &user.Stage, &user.Email, &user.Verified, &user.ImpressionQuality, &user.AlignerProgress, &user.AlignerCount, &dateString)
	if err != nil {
		fmt.Println("Database broken")
		fmt.Println(err)
		return user, err
	}

	alignerChangeDateHumanReadable, err := formatDateRFC3339ToHuman(dateString)
	if err != nil {
		fmt.Println("Date broken")
		fmt.Println(err)
		return user, err
	}

	alignerChangeDate, err := formatDateRFC3339ToHTML(dateString)
	if err != nil {
		fmt.Println("Date broken")
		fmt.Println(err)
		return user, err
	}

	user.AlignerChangeDateHumanReadable = alignerChangeDateHumanReadable
	user.AlignerChangeDate = alignerChangeDate

	return user, nil

}

func ordinal(day int) string {
	if day%10 == 1 && day != 11 {
		return "st"
	} else if day%10 == 2 && day != 12 {
		return "nd"
	} else if day%10 == 3 && day != 13 {
		return "rd"
	}
	return "th"
}

func formatDateRFC3339ToHuman(dateString string) (string, error) {

	date, err := time.Parse(time.RFC3339, dateString)
	if err != nil {
		fmt.Println(err)
		return "", err
	}

	day := date.Day()
	ordinalDay := fmt.Sprintf("%d%s", day, ordinal(day))

	formattedDate := fmt.Sprintf("%s, %s %s %d", date.Weekday(), ordinalDay, date.Month().String()[:3], date.Year())
	return formattedDate, nil
}

func formatDateRFC3339ToHTML(dateString string) (string, error) {

	date, err := time.Parse(time.RFC3339, dateString)
	if err != nil {
		fmt.Println(err)
		return "", err
	}

	//Format using magic date
	formattedDate := date.Format("2006-01-02")
	return formattedDate, nil
}

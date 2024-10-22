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
	ID       int
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

	log.Println(username, " , ", password)

	var admin Admin
	err := db.QueryRow("SELECT  username, password FROM admins WHERE username = ?", username).Scan(&admin.Username, &admin.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	log.Println(admin)

	if !checkPasswordHash(password, admin.Password) {
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

func admin_admins(c *gin.Context, db *sql.DB) {

	cookie, err := c.Cookie("session_id")

	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Please log in"})
		return
	}

	log.Printf("Cookie value: %s \n", cookie)

	username, err := verifyToken(cookie)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Please log in"})
		return
	}

	log.Println(username)

	rows, err := db.Query("SELECT id, username FROM admins")
	if err != nil {
		log.Fatal(err)
		return
	}
	defer rows.Close()

	// An userum slice to hold data from returned rows.
	var users []Admin

	// Loop through rows, using Scan to assign column data to struct fields.
	for rows.Next() {
		var user Admin
		if err := rows.Scan(&user.ID, &user.Username); err != nil {
			log.Print("Could not read all admins from DB: ", err)
			return
		}
		users = append(users, user)
	}
	if err = rows.Err(); err != nil {
		log.Print("Could not read all admins from DB: ", err)
		return
	}

	c.HTML(http.StatusOK, "admins.html", gin.H{
		"List": users,
	})

	return
}

func admin_create_admin(c *gin.Context, db *sql.DB) {

	log.Print("`Create admin user` path accessed")

	cookie, err := c.Cookie("session_id")
	if err != nil {
		c.Redirect(http.StatusTemporaryRedirect, "/admin/login")
		log.Print("Cookie error:", err)
		return
	}

	log.Printf("Cookie value: %s \n", cookie)

	_, err = verifyToken(cookie)
	if err != nil {
		c.Redirect(http.StatusTemporaryRedirect, "/admin/login")
		log.Print("Token error:", err)
		return
	}

	email := c.PostForm("email")
	password := c.PostForm("password")
	hashed_password, err := hashPassword(password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Password couldn't be hashed - please try again later"})
		log.Print("Password could not be hashed")
		log.Print(err)
		return
	}
	username := c.PostForm("username")

	address, err := mail.ParseAddress(email)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Email"})
		return
	}

	email = address.Address

	log.Printf("\nUsername: %s\n Email: %s\n Password: %s,\n Hashed Password: %s\n", username, email, password, hashed_password)
	err = create_admin_user(db, username, hashed_password)
	if err != nil {

		c.JSON(http.StatusInternalServerError, gin.H{"error": "Could not create user - please try again later"})
		return

	}

	c.HTML(http.StatusOK, "response.html", gin.H{
		"Message": "Admin user created successfully",
	})
	return

}

func create_admin_user(db *sql.DB, username string, password string) error {
	statement, err := db.Prepare(`
	    INSERT INTO admins(username, password)
	    SELECT ?, ?
	    WHERE NOT EXISTS (SELECT 1 FROM admins WHERE username = ?)
    `)
	if err != nil {
		log.Fatal(err)
	}

	_, err = statement.Exec(username, password, username)
	if err != nil {
		log.Fatal(err)
	}

	return nil
}

func admin_get_create_admin_form(c *gin.Context, db *sql.DB) {

	cookie, err := c.Cookie("session_id")
	if err != nil {
		c.Redirect(http.StatusTemporaryRedirect, "/admin/login")
		log.Print("Cookie error:", err)
		return
	}

	log.Printf("Cookie value: %s \n", cookie)

	_, err = verifyToken(cookie)
	if err != nil {
		c.Redirect(http.StatusTemporaryRedirect, "/admin/login")
		log.Print("Token error:", err)
		return
	}

	c.HTML(http.StatusOK, "adminCreateForm.html", gin.H{})
	return

}

func admin_home(c *gin.Context, db *sql.DB) {

	cookie, err := c.Cookie("session_id")

	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Please log in"})
		return
	}

	log.Printf("Cookie value: %s \n", cookie)

	username, err := verifyToken(cookie)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Please log in"})
		return
	}

	log.Println(username)

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

	log.Printf("Cookie value: %s \n", cookie)

	username, err := verifyToken(cookie)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Please log in"})
		return
	}

	log.Println(username)

	userPath := c.Param("userid")
	userPath = strings.Replace(userPath, "/", "", -1)
	id, err := strconv.Atoi(userPath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Server error"})
	}

	log.Println("the id is:", id)

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
		log.Println("Adding new image to array")
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

	log.Println(user)

	log.Println(images)

	c.HTML(http.StatusOK, "profile.html", gin.H{
		"User":   user,
		"Images": images,
	})
	return

}

func admin_user_delete(c *gin.Context, db *sql.DB) {
	log.Print("The delete handler was accessed")

	cookie, err := c.Cookie("session_id")

	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Please log in"})
		return
	}

	log.Printf("Cookie value: %s \n", cookie)

	username, err := verifyToken(cookie)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Please log in"})
		return
	}

	log.Println(username)

	userPath := c.Param("userid")
	userPath = strings.Replace(userPath, "/", "", -1)
	id, err := strconv.Atoi(userPath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Server error"})
	}

	err = delete_user(id, db)
	if err != nil {
		c.HTML(http.StatusOK, "response.html", gin.H{
			"Message": fmt.Sprint("User could not be deleted: ", err),
		})
		return
	}

	c.HTML(http.StatusOK, "response.html", gin.H{
		"Message": "User deleted successfully",
	})
	return

}

func delete_user(id int, db *sql.DB) error {

	statement, err := db.Prepare("DELETE FROM users WHERE id = ?")
	if err != nil {
		return err
	}
	result, err := statement.Exec(id)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return fmt.Errorf("no rows were deleted")
	}

	return nil

}

func admin_admin_delete(c *gin.Context, db *sql.DB) {
	log.Print("The delete handler was accessed")

	cookie, err := c.Cookie("session_id")

	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Please log in"})
		return
	}

	log.Printf("Cookie value: %s \n", cookie)

	username, err := verifyToken(cookie)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Please log in"})
		return
	}

	log.Println(username)

	userPath := c.Param("userid")
	userPath = strings.Replace(userPath, "/", "", -1)
	id, err := strconv.Atoi(userPath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Server error"})
	}

	err = delete_admin(id, db)
	if err != nil {
		c.HTML(http.StatusOK, "response.html", gin.H{
			"Message": fmt.Sprint("User could not be deleted: ", err),
		})
		return
	}

	c.HTML(http.StatusOK, "response.html", gin.H{
		"Message": "User deleted successfully",
	})
	return

}

func delete_admin(id int, db *sql.DB) error {

	statement, err := db.Prepare("DELETE FROM admins WHERE id = ?")
	if err != nil {
		return err
	}
	result, err := statement.Exec(id)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return fmt.Errorf("no rows were deleted")
	}

	return nil

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

	log.Printf("\nUsername: %s\n Email: %s\n Verified: %s\n Stage: %s\n Progress: %s\n Count: %s\n Change Date: %s\n\n", username, email, strconv.Itoa(verified), stage, aligner_progress, aligner_count, aligner_change_date)

	_, err = mail.ParseAddress(email)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Email"})
		log.Print(err)
		return
	}

	// parse string date to golang time
	date, err := time.Parse("2006-01-02", aligner_change_date)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err, "message": "Date Invalid"})
		log.Print(err)
		return
	}
	newDate := date.Format(time.RFC3339)

	stmt, err := db.Prepare("UPDATE users SET email = ?, username= ?, verified= ?, stage= ?,  alignerProgress= ?, alignerCount= ?, alignerChangeDate= ? WHERE id = ?")
	if err != nil {
		log.Println("database failed: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Server Error"})
		log.Print(err)
		return
	}

	_, err = stmt.Exec(email, username, verified, stage, aligner_progress, aligner_count, newDate, id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		log.Print(err)
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

	log.Println("the id is:", id)

	quality := c.PostForm("impressionQuality")

	log.Println(quality)

	if quality != "acceptable" && quality != "unacceptable" && quality != "unset" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Impression can only be `unset`, `acceptable` or `unacceptable`"})
		return
	}

	stmt, err := db.Prepare("UPDATE users SET impressionConfirmation = ? WHERE id = ?")
	if err != nil {
		log.Println("database failed: ", err)
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
		log.Println("execution failed: ", err)
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
		log.Println("Database broken")
		log.Println(err)
		return user, err
	}

	alignerChangeDateHumanReadable, err := formatDateRFC3339ToHuman(dateString)
	if err != nil {
		log.Println("Date broken")
		log.Println(err)
		return user, err
	}

	alignerChangeDate, err := formatDateRFC3339ToHTML(dateString)
	if err != nil {
		log.Println("Date broken")
		log.Println(err)
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
		log.Println(err)
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
		log.Println(err)
		return "", err
	}

	//Format using magic date
	formattedDate := date.Format("2006-01-02")
	return formattedDate, nil
}

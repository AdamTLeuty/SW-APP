package main

import (
	"database/sql"
	"fmt"

	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	ID       int    `json:"id"`
	Email    string `json:"email"`
	Password string `json:"password,omitempty"`
}

func hashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func checkPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func emailInHubspot(email string) bool {

	BASE_URL := "https://api.hubapi.com"

	HUBSPOT_ACCESS_TOKEN := "REMOVED"

	fmt.Println("Checking the email is correct...")

	client := &http.Client{}

	req, err := http.NewRequest("GET", BASE_URL+"/crm/v3/objects/contacts/"+email+"?idProperty=email", nil)
	if err != nil {
		log.Fatalln(err)
	}

	req.Header.Add("Authorization", "Bearer "+HUBSPOT_ACCESS_TOKEN)
	resp, err := client.Do(req)
	if err != nil {
		log.Fatalln(err)
	}
	defer resp.Body.Close()

	//body, err := ioutil.ReadAll(resp.Body)

	if resp.Status == "200 OK" {
		return true
	} else {
		return false
	}

}

func checkEmailExists(db *sql.DB, email string) (bool, error) {
	var exists bool

	query := `SELECT EXISTS(SELECT 1 FROM users WHERE email = ? LIMIT 1)`
	err := db.QueryRow(query, email).Scan(&exists)
	if err != nil {
		return false, err
	}

	return exists, nil
}

func setupRouter(db *sql.DB) *gin.Engine {
	router := gin.Default()

	router.POST("/api/register", func(c *gin.Context) {
		var user User
		if err := c.ShouldBindJSON(&user); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if user.Email == "" || user.Password == "" {

			c.JSON(http.StatusUnauthorized, gin.H{"error": "Email and Password cannot be blank"})
			return

		}

		emailInDB, err := checkEmailExists(db, user.Email)

		if emailInDB {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Contact already exists with that email within the database - please login or reset your password"})
			fmt.Println("The email is in the database already")
			return
		}

		if emailInHubspot(user.Email) != true {

			c.JSON(http.StatusUnauthorized, gin.H{"error": "Please use the email you used for your consultation"})
			fmt.Println("The email is not present in HubSpot :(")
			return

		}

		fmt.Println("Email and Password Below:")
		fmt.Println(user.Email)
		fmt.Println(user.Password)

		hashedPassword, err := hashPassword(user.Password)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
			return
		}

		stmt, err := db.Prepare("INSERT INTO users(email, password) VALUES(?, ?)")
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to prepare database statement"})
			return
		}
		_, err = stmt.Exec(user.Email, hashedPassword)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to execute database statement"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "User registered successfully"})
	})
	router.POST("/api/login", func(c *gin.Context) {
		var loginDetails User
		if err := c.ShouldBindJSON(&loginDetails); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		fmt.Println(loginDetails.Email)
		fmt.Println(loginDetails.Password)

		var user User
		err := db.QueryRow("SELECT id, email, password FROM users WHERE email = ?", loginDetails.Email).Scan(&user.ID, &user.Email, &user.Password)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
			return
		}

		if !checkPasswordHash(loginDetails.Password, user.Password) {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Logged in successfully"})
	})

	return router
}

func main() {
	db, err := sql.Open("sqlite3", "./users.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	statement, err := db.Prepare("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, email TEXT, password TEXT)")
	if err != nil {
		log.Fatal(err)
	}
	statement.Exec()

	router := setupRouter(db)
	s := &http.Server{
		Addr:           ":8080",
		Handler:        router,
		ReadTimeout:    10 * time.Second,
		WriteTimeout:   10 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}

	fmt.Println("Starting server on port 8080...")
	if err := s.ListenAndServe(); err != nil {
		log.Fatal(err)
	}
}

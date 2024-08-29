package main

import (
	"bufio"
	"database/sql"
	"fmt"
	"os"

	"log"
	"net/http"
	"time"

	"math/rand/v2"

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

	router.POST("/api/register", LogAccess(), func(c *gin.Context) {
		register(c, db)
	})
	router.POST("/api/login", LogAccess(), func(c *gin.Context) {
		login(c, db)
	})
	router.POST("/api/loginWithToken", LogAccess(), func(c *gin.Context) {
		loginWithToken(c, db)
	})
	router.POST("/api/uploadImage", func(c *gin.Context) {
		upload(c, db)
	})

	/*
		   router.POST("/api/upload", LogAccess(), func(c *gin.Context) {
				upload(c, db)
			})*/

	return router
}

func main() {
	db, err := sql.Open("sqlite3", "./users.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	statement, err := db.Prepare("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, email TEXT, password TEXT, verified INTEGER, authcode INTEGER)")
	if err != nil {
		log.Fatal(err)
	}
	statement.Exec()

	go func() {
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
	}()

	go serverSideControls()

	select {}

}

func serverSideControls() {

	reader := bufio.NewReader(os.Stdin)
	for {
		fmt.Println("---Admin control centre---")
		fmt.Println("Press a key to perform an admin action: ")
		input, err := reader.ReadString('\n')
		if err != nil {
			fmt.Printf("Error reading input: %v\n", err)
			continue
		}

		switch input[0] {
		case 'q':
			fmt.Println("Quitting...")
			os.Exit(0)
		case 'e':
			sendEmail("test@gmail.com", "987654")
			fmt.Println("Sending an email")
		case 'r':
			//Generate a random number, padded by zeros
			s := fmt.Sprintf("%04d", rand.IntN(9999))
			fmt.Println(s)
		default:
			fmt.Println("Pressed a button")
		}
	}

}

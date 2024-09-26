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
	Username string `json:"username,omitempty"`
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

	HUBSPOT_ACCESS_TOKEN := os.Getenv("HUBSPOT_API_KEY")

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

func generateAuthCode() string {
	authCode := fmt.Sprintf("%06d", rand.IntN(999999))
	fmt.Println("Authcode generated: ", authCode)
	return authCode
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

	router.LoadHTMLGlob("./admin/pages/*.html")

	// Apply AuthRequired middleware to protect static files
	authorized := router.Group("/admin/")
	authorized.Use(admin_auth(db))
	{
		authorized.Static("/assets", "./admin/assets")
		authorized.Static("/images", "./images")
	}

	router.Static("/admin/public/assets", "./admin/public/assets")

	api := router.Group("/api/v1/")
	api.Use(SimpleLogAccess())
	{
		api.POST("/login", LogAccess(), LowercaseEmail(), func(c *gin.Context) {
			login(c, db)
		})

		api.POST("/register", LogAccess(), LowercaseEmail(), func(c *gin.Context) {
			register(c, db)
		})

		api.POST("/loginWithToken", func(c *gin.Context) {
			loginWithToken(c, db)
		})

		api.POST("/verifyEmail", LowercaseEmail(), func(c *gin.Context) {
			verifyEmail(c, db)
		})

		api.POST("/resendVerifyEmail", LogAccess(), LowercaseEmail(), func(c *gin.Context) {
			resendVerifyEmail(c, db)
		})

		authorized := api.Group("/")
		authorized.Use(check_bearer(db))
		{

			authorized.POST("/uploadImage", func(c *gin.Context) {
				upload(c, db)
			})
			authorized.GET("/userData", func(c *gin.Context) {
				getUserData(c, db)
			})
			authorized.POST("/userData", func(c *gin.Context) {
				setUserData(c, db)
			})
			authorized.POST("/changeAlignerDate", func(c *gin.Context) {
				updateAlignerChangeDate(c, db)
			})
		}

	}

	router.GET("/admin/login", func(c *gin.Context) {
		admin_login(c, db)
	})

	router.POST("/admin/login", func(c *gin.Context) {
		admin_login_form(c, db)
	})

	router.GET("/admin/home", func(c *gin.Context) {
		admin_home(c, db)
	})

	router.GET("/admin/user/:userid", func(c *gin.Context) {
		admin_user_profile(c, db)
	})

	router.POST("/admin/user/updateImpressionState/:userid", admin_auth(db), func(c *gin.Context) {
		edit_user_impression_state(c, db)
	})

	router.GET("/admin/components", func(c *gin.Context) {
		admin_home(c, db)
	})

	auth_components := router.Group("/admin/components/")
	auth_components.Use(admin_auth(db))
	{
		auth_components.GET("/userInfoForm/:userid", func(c *gin.Context) {
			admin_get_user_info_form(c, db)
		})

		auth_components.POST("/userInfoForm/:userid", func(c *gin.Context) {
			admin_edit_user_info_form(c, db)
		})
	}

	return router
}

func main() {
	db, err := sql.Open("sqlite3", "./users.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	statement, err := db.Prepare("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, email TEXT, password TEXT, username TEXT, verified INTEGER, authcode INTEGER, stage TEXT, impressionConfirmation TEXT, alignerProgress INTEGER, alignerCount INTEGER, alignerChangeDate TEXT, expo_notification_token TEXT)")
	if err != nil {
		log.Fatal(err)
	}
	statement.Exec()

	statement, err = db.Prepare("CREATE TABLE IF NOT EXISTS admins (id INTEGER PRIMARY KEY, username TEXT, password TEXT)")
	if err != nil {
		log.Fatal(err)
	}
	statement.Exec()

	//Create a table for images uploaded by the user
	//Each image has a userID for a corresponding user in the `users` table
	//Each image has an `imageType`, showing either that the image is of an aligner update or impression check (`aligner`/`impression`)
	//Each image has a file path for it's location on the server
	statement, err = db.Prepare("CREATE TABLE IF NOT EXISTS images (id INTEGER PRIMARY KEY,userID INTEGER, imageType TEXT, path TEXT,FOREIGN KEY (userID) REFERENCES users(id) ON DELETE CASCADE) ")
	if err != nil {
		log.Fatal(err)
	}
	statement.Exec()

	// Set up and start the cron job (in a separate function)
	cronJob := setupCronJob(db)

	// Defer stopping the cron scheduler until the program exits
	defer cronJob.Stop()

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

	go serverSideControls(db)

	select {}

}

func serverSideControls(db *sql.DB) {

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
		case 'u':
			updateDrive()
		case 'i':
			setUserEmailVerified(db, "Test@gmail.com")
		case 'r':
			//Generate a random number, padded by zeros
			s := fmt.Sprintf("%04d", rand.IntN(9999))
			fmt.Println(s)
		case 'n':
			token, err := getUserExpoToken(2, db)
			if err != nil {
				return
			}
			notify(token, "Smile Correct Club!", "Testy, it's time to change your aligners!")
		case 'c':
			getUsersWithNowChangeDate(db)
		default:
			fmt.Println("Pressed a button")
		}
	}

}

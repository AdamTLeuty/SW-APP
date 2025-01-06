package main

import (
	"bufio"
	"database/sql"
	"fmt"
	"io"
	"os"
	"strconv"

	"log"
	"net/http"
	"time"

	"math/rand/v2"

	"github.com/gin-gonic/gin"
	_ "github.com/mattn/go-sqlite3"
	"golang.org/x/crypto/bcrypt"

	ratelimit "github.com/JGLTechnologies/gin-rate-limit"
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

func generateAuthCode() string {
	authCode := fmt.Sprintf("%06d", rand.IntN(999999))
	log.Println("Authcode generated: ", authCode)
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

func keyFunc(c *gin.Context) string {
	return c.ClientIP()
}

func errorHandler(c *gin.Context, info ratelimit.Info) {
	c.String(429, "Too many requests. Try again in "+time.Until(info.ResetTime).String())
}

func setupRouter(db *sql.DB) *gin.Engine {
	router := gin.Default()

	router.LoadHTMLGlob("./admin/pages/*.html")

	// This makes it so each ip can only make 5 requests per second
	store := ratelimit.InMemoryStore(&ratelimit.InMemoryOptions{
		Rate:  time.Second,
		Limit: 5,
	})
	rate_limit := ratelimit.RateLimiter(store, &ratelimit.Options{
		ErrorHandler: errorHandler,
		KeyFunc:      keyFunc,
	})

	// This makes it so each ip can only make 6 requests per minute (Request every ten seconds)
	store_slow := ratelimit.InMemoryStore(&ratelimit.InMemoryOptions{
		Rate:  time.Minute,
		Limit: 6,
	})
	rate_limit_slow := ratelimit.RateLimiter(store_slow, &ratelimit.Options{
		ErrorHandler: errorHandler,
		KeyFunc:      keyFunc,
	})

	// Apply AuthRequired middleware to protect static files
	authorized := router.Group("/admin/")
	authorized.Use(admin_auth(db))
	{
		authorized.Static("/assets", "./admin/assets")
		authorized.Static("/images", "./images")
	}

	router.Static("/admin/public/assets", "./admin/public/assets")

	api := router.Group("/api/v1/")
	api.Use(rate_limit, SimpleLogAccess())
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

		api.POST("/hubspot", authenticate_hubspot(db), func(c *gin.Context) {
			hubspot_listener(c, db)
		})

		authorized := api.Group("/")
		authorized.Use(check_bearer(db), check_verified(db))
		{

			authorized.POST("/uploadImage", rate_limit_slow, func(c *gin.Context) {
				upload(c, db)
			})
			authorized.GET("/userData", func(c *gin.Context) {
				log.Println("Getting user data...")
				getUserData(c, db)
			})
			authorized.POST("/userData", func(c *gin.Context) {
				setUserData(c, db)
			})
			authorized.GET("/dentist/:dentistid", func(c *gin.Context) {
				log.Println("Getting dentist data...")
				getDentistData(c, db)
			})
			authorized.POST("/changeAlignerDate", func(c *gin.Context) {
				updateAlignerChangeDate(c, db)
			})
			authorized.PUT("/signWaiver", func(c *gin.Context) {
				signWaiver(c, db)
			})
		}

	}

	router.GET("/admin/login", rate_limit, func(c *gin.Context) {
		admin_login(c, db)
	})

	router.POST("/admin/login", rate_limit, func(c *gin.Context) {
		admin_login_form(c, db)
	})

	admin := router.Group("/admin/")
	admin.Use(admin_auth(db))
	{

		admin.GET("/", rate_limit, func(c *gin.Context) {
			admin_home(c, db)
		})

		admin.GET("/home", rate_limit, func(c *gin.Context) {
			admin_home(c, db)
		})

		admin.GET("/admins", rate_limit, func(c *gin.Context) {
			admin_admins(c, db)
		})

		admin.POST("/admins/create", rate_limit, func(c *gin.Context) {
			admin_create_admin(c, db)
		})

		admin.GET("/admins/create", func(c *gin.Context) {
			admin_get_create_admin_form(c, db)
		})

		admin.GET("/user/:userid", rate_limit, func(c *gin.Context) {
			admin_user_profile(c, db)
		})

		admin.POST("/user/delete/:userid", rate_limit, func(c *gin.Context) {
			admin_user_delete(c, db)
		})

		admin.POST("/admins/delete/:userid", rate_limit, func(c *gin.Context) {
			admin_admin_delete(c, db)
		})

		admin.POST("/user/updateImpressionState/:userid", rate_limit, admin_auth(db), func(c *gin.Context) {
			edit_user_impression_state(c, db)
		})

		admin.GET("/components", rate_limit, func(c *gin.Context) {
			admin_home(c, db)
		})

	}

	auth_components := router.Group("/admin/components/")
	auth_components.Use(rate_limit, admin_auth(db))
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

	// log to custom file
	LOG_FILE := os.Getenv("LOG_FILE")
	// open log file
	logFile, err := os.OpenFile(LOG_FILE, os.O_APPEND|os.O_RDWR|os.O_CREATE, 0644)
	if err != nil {
		log.Panic(err)
	}
	defer logFile.Close()

	gin.DefaultWriter = io.MultiWriter(logFile)

	// Set log out put and enjoy :)
	log.SetOutput(logFile)

	// optional: log date-time, filename, and line number
	log.SetFlags(log.Lshortfile | log.LstdFlags)

	log.Println("Program started...")

	log.Print("Testing the stage to stage converter")
	stage, err := hubspotStageToUserStage("Treatment Dispatched to Client")
	if err != nil {
		log.Print(err)
	}
	log.Print(stage)
	stage, err = hubspotStageToUserStage("Invalid string")
	if err != nil {
		log.Print(err)
	}
	log.Print(stage)

	db, err := sql.Open("sqlite3", "./users.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	statement, err := db.Prepare(`
		CREATE TABLE IF NOT EXISTS users
		(id INTEGER PRIMARY KEY, email TEXT, password TEXT, username TEXT, verified INTEGER,
	 	authcode INTEGER, stage TEXT, impressionConfirmation TEXT, alignerProgress INTEGER,
		alignerCount INTEGER, alignerChangeDate TEXT, expo_notification_token TEXT, can_change_stage INTEGER,
		dentistID INTEGER, medical_waiver TEXT, medical_waiver_signed INTEGER, FOREIGN KEY (dentistID) REFERENCES dentists(jarvisID))
		`)
	if err != nil {
		log.Fatal(err)
	}
	statement.Exec()

	statement, err = db.Prepare("CREATE TABLE IF NOT EXISTS admins (id INTEGER PRIMARY KEY, username TEXT, password TEXT)")
	if err != nil {
		log.Fatal(err)
	}
	_, err = statement.Exec()
	if err != nil {
		log.Fatal(err)
	}

	statement, err = db.Prepare(`
	    INSERT INTO admins(username, password)
	    SELECT ?, ?
	    WHERE NOT EXISTS (SELECT 1 FROM admins WHERE username = ?)
    `)
	if err != nil {
		log.Fatal(err)
	}

	adminPass, err := hashPassword(os.Getenv("DEFAULT_ADMIN_PASS"))
	if err != nil {
		log.Fatal("The default admin password cannot be parsed correctly: ", err)
	}

	_, err = statement.Exec(os.Getenv("DEFAULT_ADMIN_NAME"), adminPass, os.Getenv("DEFAULT_ADMIN_NAME"))
	if err != nil {
		log.Fatal(err)
	}

	statement, err = db.Prepare("CREATE TABLE IF NOT EXISTS user_hubspot_data (id INTEGER PRIMARY KEY, userID INTEGER, process_stage TEXT, object_id INTEGER, FOREIGN KEY (userID) REFERENCES users(id) ON DELETE CASCADE) ")
	if err != nil {
		log.Fatal(err)
	}
	statement.Exec()

	//Create a table for images uploaded by the user
	//Each image has a userID for a corresponding user in the `users` table
	//Each image has an `imageType`, showing either that the image is of an aligner update or impression check (`aligner`/`impression`)
	//Each image has a file path for it's location on the server
	statement, err = db.Prepare("CREATE TABLE IF NOT EXISTS images (id INTEGER PRIMARY KEY,userID INTEGER, imageType TEXT, path TEXT, FOREIGN KEY (userID) REFERENCES users(id) ON DELETE CASCADE) ")
	if err != nil {
		log.Fatal(err)
	}
	statement.Exec()

	statement, err = db.Prepare("CREATE TABLE IF NOT EXISTS dentists (id INTEGER PRIMARY KEY, jarvisID INTEGER UNIQUE, name TEXT, street_number TEXT, street TEXT, city TEXT, region TEXT, country TEXT, postcode TEXT)")
	if err != nil {
		log.Fatal(err)
	}
	statement.Exec()

	// Set up and start the cron job (in a separate function)
	cronJob := setupCronJob(db)

	// Defer stopping the cron scheduler until the program exits
	defer cronJob.Stop()

	port := os.Getenv("PORT")

	go func() {

		router := setupRouter(db)
		s := &http.Server{
			Addr:           port,
			Handler:        router,
			ReadTimeout:    10 * time.Second,
			WriteTimeout:   10 * time.Second,
			MaxHeaderBytes: 1 << 20,
		}

		log.Println("Starting server on port: ", port)
		if err := s.ListenAndServe(); err != nil {
			log.Fatal(err)
		}
	}()

	useControls, _ := strconv.ParseBool(os.Getenv("ADMIN_CONTROLS"))
	if err != nil {
		log.Fatal("ADMIN_CONTROLS not set correctly: ", err)
	}
	if useControls {
		go serverSideControls(db)
	}
	select {}

}

func serverSideControls(db *sql.DB) {

	reader := bufio.NewReader(os.Stdin)
	for {
		log.Println("---Admin control centre---")
		log.Println("Press a key to perform an admin action: ")
		input, err := reader.ReadString('\n')
		if err != nil {
			log.Printf("Error reading input: %v\n", err)
			continue
		}

		switch input[0] {
		case 'q':
			log.Println("Quitting...")
			os.Exit(0)
		case 'e':
			sendEmail("test@gmail.com", "987654", "Testname")
			log.Println("Sending an email")
		case 'u':
			updateDrive()
		case 'i':
			setUserEmailVerified(db, "Test@gmail.com")
		case 'r':
			//Generate a random number, padded by zeros
			s := fmt.Sprintf("%04d", rand.IntN(9999))
			log.Println(s)
		case 'n':
			token, err := getUserExpoToken(2, db)
			if err != nil {
				return
			}
			notify(token, "Smile Correct Club!", "Testy, it's time to change your aligners!", "")
		case 'c':
			getUsersWithNowChangeDate(db)
		case 'h':
			data, err := getUserHubspotData("test@gmail.com")
			if err != nil {
				log.Println("Error: ", err)
			} else {
				log.Println(data)
			}
		default:
			log.Println("Pressed a button")
		}
	}

}

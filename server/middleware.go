package main

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func admin_auth(db *sql.DB) gin.HandlerFunc {

	return func(c *gin.Context) {

		cookie, err := c.Cookie("session_id")

		if err != nil {
			c.Redirect(http.StatusUnauthorized, "/admin/login")
			c.Abort()
			return
		}

		username, err := verifyToken(cookie)
		if err != nil {
			c.Redirect(http.StatusUnauthorized, "/admin/login")
			c.Abort()
			return
		}

		var exists bool
		err = db.QueryRow("SELECT COUNT(1) FROM admins WHERE username = ?", username).Scan(&exists)
		if err != nil {
			c.Redirect(http.StatusSeeOther, "/admin/login")
			c.Abort()
			return
		}

		if !exists {
			c.Redirect(http.StatusUnauthorized, "/admin/login")
			c.Abort()
			return
		}

		// Continue to the handler
		c.Next()
	}

}

func LogAccess() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Read the request body
		bodyBytes, err := ioutil.ReadAll(c.Request.Body)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
			c.Abort()
			return
		}

		// Restore the io.ReadCloser to its original state
		c.Request.Body = ioutil.NopCloser(bytes.NewBuffer(bodyBytes))

		// Store the JSON data in the context
		var jsonData map[string]interface{}
		if err := json.Unmarshal(bodyBytes, &jsonData); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON"})
			c.Abort()
			return
		}

		c.Set("jsonData", jsonData)

		// After the handler has completed, access the stored JSON data
		if val, exists := c.Get("jsonData"); exists {
			if data, ok := val.(map[string]interface{}); ok {
				log.Printf("Processed JSON Data: %v\n", data)
				log.Printf("Email: %v\n", data["email"])
				log.Printf("Password: %v\n", data["password"])
			} else {
				log.Println("jsonData is not a map[string]interface{}")
			}
		}

		// Continue to the handler
		c.Next()
	}
}

func SimpleLogAccess() gin.HandlerFunc {
	return func(c *gin.Context) {
		log.Println("A handler was accessed")

		// Continue to the handler
		c.Next()
	}
}

type Email_Token_JSON struct {
	Email string `json:"email"`
	Token string `json:"token"`
}

func checkEmailAndTokenMatch() gin.HandlerFunc {
	//Needs to be checked that it works both on multipart forms and json-only forms

	return func(c *gin.Context) {

		// Extract the JSON part
		jsonData := c.PostForm("json")
		var dataToCheck Email_Token_JSON
		if err := json.Unmarshal([]byte(jsonData), &dataToCheck); err != nil {
			log.Println("Error parsing JSON:", err)
			c.String(http.StatusBadRequest, "Error parsing JSON")
			return
		}

		log.Println("Checking email and token match...")
		log.Println(dataToCheck.Token)
		log.Println(dataToCheck.Email)

		tokenEmail, err := verifyToken(dataToCheck.Token)

		log.Println(tokenEmail)

		if err != nil {
			log.Println("Error parsing JSON:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error authenticating. Please try again later"})
			c.Abort()
			return
		}

		if tokenEmail != dataToCheck.Email {
			//User's token does not belong to the email provided
			log.Println("Finished checking email and token, they do not match")
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Error checking user token, please try again later"})
			c.Abort()
			return
		}

		log.Println("Finished checking email and token, they match")

		// Continue to the handler
		c.Next()
	}

}

func AuthoriseImageUpload() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Read the request body
		bodyBytes, err := ioutil.ReadAll(c.Request.Body)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
			c.Abort()
			return
		}

		// Restore the io.ReadCloser to its original state
		c.Request.Body = ioutil.NopCloser(bytes.NewBuffer(bodyBytes))

		// Store the JSON data in the context
		var jsonData map[string]interface{}
		if err := json.Unmarshal(bodyBytes, &jsonData); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON"})
			c.Abort()
			return
		}

		c.Set("jsonData", jsonData)

		// After the handler has completed, access the stored JSON data
		if val, exists := c.Get("jsonData"); exists {
			if data, ok := val.(map[string]interface{}); ok {
				log.Printf("Processed JSON Data: %v\n", data)
			} else {
				log.Println("jsonData is not a map[string]interface{}")
			}
		}

		// Continue to the handler
		c.Next()
	}
}

func LowercaseEmail() gin.HandlerFunc {

	return func(c *gin.Context) {

		log.Println("Changing the email to be lowercase")

		// Read the request body
		bodyBytes, err := io.ReadAll(c.Request.Body)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
			c.Abort()
			return
		}

		var dataToCheck map[string]interface{}
		if err := json.Unmarshal(bodyBytes, &dataToCheck); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		if dataToCheck["email"] == nil {
			//The email is missing from the data - this is ~bad~
			c.JSON(http.StatusBadRequest, gin.H{"error": "There is no email"})
			c.Abort()
			return
		}

		//Set email to be lowercase
		dataToCheck["email"] = strings.ToLower(dataToCheck["email"].(string))
		c.Set("email", dataToCheck["email"])

		modifiedBodyBytes, err := json.Marshal(dataToCheck)
		if err != nil {
			c.AbortWithStatusJSON(500, gin.H{"error": "Failed to marshal JSON"})
			return
		}

		// Restore the io.ReadCloser to its original state, with email modified
		c.Request.Body = io.NopCloser(bytes.NewBuffer(modifiedBodyBytes))

		// Continue to the handler
		c.Next()
	}

}

func check_bearer(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {

		var h Header
		if err := c.BindHeader(&h); err != nil {
			log.Println(err)
			c.JSON(http.StatusBadRequest, gin.H{"error": "Request needs to include a auth bearer token"})
			c.Abort()
			return
		}

		log.Println(h.Authorization)
		token := strings.Replace(h.Authorization, "Bearer ", "", 1)
		log.Println("Token", token)
		log.Println(token)

		claimValue, err := verifyToken(token)
		if err != nil {
			log.Printf("Error: %v\n", err)
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token has expired, please login again"})
			c.Abort()
			return
		} else {
			log.Printf("Claim value: %v\n", claimValue)
		}
		log.Println("The decoded claim is: ", claimValue)
		log.Println("The error from the token verification is: ", err)

		emailInDB, err := checkEmailExists(db, claimValue.(string))

		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Please try again later"})
			c.Abort()
			return
		}

		if !emailInDB {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid User"})
			c.Abort()
			return
		}

		c.Set("email", claimValue.(string))

		// Continue to the handler
		c.Next()
	}
}

func check_verified(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		log.Println("Checking whether user verified")

		email := c.GetString("email")

		verified, err := checkUserEmailVerified(db, email)
		if err != nil {
			log.Fatal(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Please login again or try again later"})
			log.Println("500 - Couldn't check whether user is verified or not")
			c.Abort()
			return
		}
		if !verified {
			//The user's email is already verified
			c.JSON(http.StatusForbidden, gin.H{"error": "User not yet verified"})
			log.Println("403 - User not yet verified")
			c.Abort()
			return
		}

		log.Println("User is verified - continue to next handler")
		// Continue to the handler
		c.Next()
	}
}

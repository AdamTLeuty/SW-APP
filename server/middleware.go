package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

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
				fmt.Printf("Processed JSON Data: %v\n", data)
				fmt.Printf("Email: %v\n", data["email"])
				fmt.Printf("Password: %v\n", data["password"])
			} else {
				fmt.Println("jsonData is not a map[string]interface{}")
			}
		}

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

		fmt.Println("Checking email and token match...")
		fmt.Println(dataToCheck.Token)
		fmt.Println(dataToCheck.Email)

		tokenEmail, err := verifyToken(dataToCheck.Token)

		fmt.Println(tokenEmail)

		if err != nil {
			log.Println("Error parsing JSON:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error authenticating. Please try again later"})
			c.Abort()
			return
		}

		if tokenEmail != dataToCheck.Email {
			//User's token does not belong to the email provided
			fmt.Println("Finished checking email and token, they do not match")
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Error checking user token, please try again later"})
			c.Abort()
			return
		}

		fmt.Println("Finished checking email and token, they match")

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
				fmt.Printf("Processed JSON Data: %v\n", data)
			} else {
				fmt.Println("jsonData is not a map[string]interface{}")
			}
		}

		// Continue to the handler
		c.Next()
	}
}

func LowercaseEmail() gin.HandlerFunc {

	return func(c *gin.Context) {

		fmt.Println("Changing the email to be lowercase")

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

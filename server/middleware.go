package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

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

package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

type UploadData struct {
	Date string `json:"date"`
	Type string `json:"type"`
}

func upload(c *gin.Context, db *sql.DB) {

	log.Println("Upload endpoint accessed")

	// Extract the JSON part
	jsonData := c.PostForm("json")
	var uploadData UploadData
	if err := json.Unmarshal([]byte(jsonData), &uploadData); err != nil {
		log.Println("Error parsing JSON:", err)
		c.String(http.StatusBadRequest, "Error parsing JSON")
		return
	}

	email := c.GetString("email")

	var userID int

	err := db.QueryRow("SELECT id FROM users WHERE email = ?", email).Scan(&userID)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	// single file
	file, err := c.FormFile("file")
	if err != nil {
		log.Println("Error retrieving the file:", err)
		c.String(http.StatusBadRequest, "Error retrieving the file")
		return
	}

	// Open the file to inspect its content
	src, err := file.Open()
	if err != nil {
		// handle error
	}
	defer src.Close()

	// Read the first 512 bytes to detect the MIME type
	buffer := make([]byte, 512)
	if _, err := src.Read(buffer); err != nil {
		// handle error
	}

	// Detect the MIME type
	detectedType := http.DetectContentType(buffer)
	if detectedType != "image/jpeg" && detectedType != "image/png" && detectedType != "image/gif" {
		// Invalid file type
		c.String(http.StatusBadRequest, "Invalid file type")
		return
	}

	// Reset file pointer
	if _, err := src.Seek(0, 0); err != nil {
		// handle error
		log.Println("Error resetting file pointer:", err)
	}

	filename := filepath.Base(file.Filename)
	filename = strings.ReplaceAll(filename, " ", "_")
	ext := filepath.Ext(filename)
	base := email + uploadData.Date

	// Generate a unique filename
	newFilename := fmt.Sprintf("%s_%d%s", base, time.Now().UnixNano(), ext)

	// Define the destination path where the file should be saved
	var dstFolder string

	if uploadData.Type == "progress" {
		dstFolder = "./images/progressPictures/" + email + "/"
	} else {
		dstFolder = "./images/impressionVerification/" + email + "/"
	}

	// Create the directory if it doesn't exist
	if err := os.MkdirAll(dstFolder, os.ModePerm); err != nil {
		log.Println("Error creating directory:", err)
		c.String(http.StatusInternalServerError, "Error creating directory")
		return
	}

	dst := filepath.Join(dstFolder, newFilename)

	// Save the file to the specific destination
	if err := c.SaveUploadedFile(file, dst); err != nil {
		log.Println("Error saving the file:", err)
		c.String(http.StatusInternalServerError, "Error saving the file")
		return
	}

	err = addImageToTable(db, userID, uploadData.Type, dst)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "File could not be uploaded, please try again later"})
		log.Println("Could not add image to table")
		log.Println(err)
		return
	}
	uploadToDrive, err := strconv.ParseBool(os.Getenv("UPLOAD_TO_DRIVE"))
	if err != nil {
		return
	}
	if uploadToDrive {
		updateDrive()
	}
	c.JSON(http.StatusOK, gin.H{"message": "File uploaded successfully"})

}

func addImageToTable(db *sql.DB, userID int, imageType string, path string) error {

	stmt, err := db.Prepare("INSERT INTO images(userID, imageType, path) VALUES(?, ?, ?)")
	if err != nil {

		return err
	}
	_, err = stmt.Exec(userID, imageType, path)
	if err != nil {

		return err
	}

	return nil

}

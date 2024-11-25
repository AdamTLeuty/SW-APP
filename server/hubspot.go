package main

import (
	"bytes"
	"crypto/hmac"
	"crypto/sha256"
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

func authenticate_hubspot(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {

		log.Println("Validating request is from Hubspot...")

		headers := c.Request.Header
		signatureVersion := headers.Get("X-Hubspot-Signature-Version")
		signature := headers.Get("X-Hubspot-Signature")

		if signatureVersion == "" || signature == "" {
			log.Println("Missing Hubspot signature headers")
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}

		ByteBody, err := io.ReadAll(c.Request.Body)
		if err != nil {
			log.Println("Body could not be read")
			c.AbortWithStatus(http.StatusBadRequest)
			return
		}
		c.Request.Body = io.NopCloser(bytes.NewBuffer(ByteBody))

		log.Println("Hubspot secret version:", signatureVersion)
		log.Println("Hubspot signature:", signature)

		body := ByteBody
		secret := os.Getenv("HUBSPOT_CLIENT_SECRET")

		// Handle different signature versions
		var calculatedSignature string
		switch signatureVersion {
		case "v3":
			// Concatenate the secret with the request body as described in the documentation for v3
			secretAndBody := secret + string(body)

			h := sha256.New()
			h.Write([]byte(secretAndBody))
			calculatedSignature = hex.EncodeToString(h.Sum(nil))

		case "v1":
			// For v1, HubSpot uses HMAC with SHA-256
			s := secret + string(body)

			r1 := sha256.Sum256([]byte(s))
			calculatedSignature = hex.EncodeToString(r1[:])
		default:
			log.Println("Unsupported signature version:", signatureVersion)
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}

		log.Println("The calculated checksum is:", calculatedSignature)

		// Use hmac.Equal to compare in constant time
		if !hmac.Equal([]byte(calculatedSignature), []byte(signature)) {
			log.Println("Invalid signature")
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}

		log.Println("The checksum given is correct")

		c.Next()
	}
}

func hubspot_listener(c *gin.Context, db *sql.DB) {

	var jsonData []interface{}

	if err := c.ShouldBindJSON(&jsonData); err != nil {
		log.Println("Could not read the JSON")
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid JSON"})
		return
	}

	innerData := jsonData[0]

	log.Println("First child of json array is: ", innerData)

	data, ok := innerData.(map[string]interface{})
	if !ok {
		log.Println("Should be a map")
		c.Status(http.StatusBadRequest)
		return
	}
	if data == nil {
		log.Println("Cannot be empty")
		c.Status(http.StatusBadRequest)
	}

	log.Println("Object ID: ", data["objectId"])
	log.Printf("Object Id Type: %T\n", data["objectId"])
	objectID := strconv.FormatFloat(data["objectId"].(float64), 'f', -1, 64)
	log.Println("Object ID: ", objectID)

	log.Println("Property name", data["propertyName"])
	propertyName, ok := data["propertyName"].(string)
	if !ok {
		log.Println("Property name is not a string")
	}

	log.Println("Property Value", data["propertyValue"])
	propertyValue, ok := data["propertyValue"].(string)
	if !ok {
		log.Println("Property value is not a string")
	}

	err := updateLocalHubspotProperty(db, objectID, propertyName, propertyValue)
	if err != nil {
		if strings.HasPrefix(err.Error(), "No rows were updated") {
			//No rows were updated, but this request doesn't need to be repeated
			c.Status(http.StatusAccepted)
			return
		} else {
			log.Println(err)
			c.Status(http.StatusBadRequest)
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"received": data,
	})

}

func updateLocalHubspotProperty(db *sql.DB, objectID string, propertyName string, propertyValue string) error {
	log.Println(objectID, propertyName, propertyValue)

	var fieldName string
	var fieldValue string

	if propertyName == "aftercare_stage__contact_" {
		fieldName = "process_stage"
		fieldValue = propertyValue
	} else {
		return errors.New(fmt.Sprint("Unsupported property name: ", propertyName))
	}

	//This is fine, as `fieldName` can only ever be one of the values defined in the above if statement
	//So no sql injection can occur
	query := fmt.Sprintf("UPDATE user_hubspot_data SET %s = ? WHERE object_id = ?", fieldName)
	stmt, err := db.Prepare(query)
	if err != nil {
		log.Println("database failed: ", err)
		return err
	}

	res, err := stmt.Exec(fieldValue, objectID)
	if err != nil {
		log.Println("Execution failed: ", err)
		return err
	}

	// Check how many rows were affected
	rowsAffected, err := res.RowsAffected()
	if err != nil {
		log.Fatal(err)
	}

	// Check if any row was updated
	if rowsAffected < 1 {
		return errors.New(fmt.Sprint("No rows were updated - the user with Object ID of ", objectID, " is not in the database."))
	}

	return nil
}

func emailInHubspot(email string) bool {

	BASE_URL := "https://api.hubapi.com"

	HUBSPOT_ACCESS_TOKEN := os.Getenv("HUBSPOT_API_KEY")

	log.Println("Checking the email is correct...")

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

// If more data needed, add here and in `getUserHubspotData` function
type HubspotData struct {
	ObjectID      int    `json:"id,omitempty"`
	Process_Stage string `json:"process_stage,omitempty"`
	Aligner_Count int    `json:"aligner_count"`
}

type Properties struct {
	ProcessStage  string `json:"process_stage"`
	Aligner_Count string `json:"aligner_count"`
}

type HubspotResponse struct {
	ID         string     `json:"id"`
	Properties Properties `json:"properties"`
}

func getUserHubspotData(email string) (HubspotData, error) {

	BASE_URL := "https://api.hubapi.com"

	HUBSPOT_ACCESS_TOKEN := os.Getenv("HUBSPOT_API_KEY")

	log.Println("Fetching user data from hubspot under this email: ", email)

	client := &http.Client{}

	//See: https://developers.hubspot.com/docs/api/crm/contacts
	//Add more properties under the `properties` url query if needed
	requestURL := BASE_URL + "/crm/v3/objects/contacts/" + email + "?idProperty=email&properties=aftercare_stage__contact_,aligner_count"
	log.Println("Request url is: ", requestURL)
	req, err := http.NewRequest("GET", requestURL, nil)
	if err != nil {
		log.Fatalln(err)
	}

	req.Header.Add("Authorization", "Bearer "+HUBSPOT_ACCESS_TOKEN)
	resp, err := client.Do(req)
	if err != nil {
		log.Fatalln(err)
	}
	defer resp.Body.Close()

	if resp.StatusCode == http.StatusOK {
		bodyBytes, err := io.ReadAll(resp.Body)
		if err != nil {
			log.Println(err)
		}
		bodyString := string(bodyBytes)
		log.Println(bodyString)

		var data HubspotResponse

		err = json.Unmarshal([]byte(bodyBytes), &data)
		if err != nil {
			log.Println("Error:", err)
			return HubspotData{}, err
		}
		log.Println("Returning: ", data)

		var userData HubspotData

		userData.ObjectID, err = strconv.Atoi(data.ID)
		if err != nil {
			return HubspotData{}, err
		}

		userData.Process_Stage = data.Properties.ProcessStage

		if data.Properties.Aligner_Count != "" {
			userData.Aligner_Count, err = strconv.Atoi(data.Properties.Aligner_Count)
			if err != nil {
				return HubspotData{}, err
			}
		}

		return userData, nil

	} else {

		return HubspotData{}, errors.New(fmt.Sprint("Hubspot responded with a status code: ", resp.Status))
	}

}

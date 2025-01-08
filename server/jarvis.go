package main

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
)

type JarvisResponse struct {
	ID              int    `json:"id"`
	Name            string `json:"name"`
	LastName        string `json:"last_name"`
	TermsAccepted   bool   `json:"terms_accepted"`
	AssignedDentist int    `json:"assigned_dentist"`
	TermsLinks      string `json:"terms_links"`
}

func jarvis_get_customer_data(email string) (JarvisResponse, error) {

	BASE_URL := os.Getenv("JARVIS_BASE_URL")

	JARVIS_AUTH_TOKEN := os.Getenv("JARVIS_AUTH_TOKEN")

	log.Println("Fetching customer data for user: ", email)

	client := &http.Client{}

	requestURL := fmt.Sprintf("%sapi/smilewhite_app/customer/%s/", BASE_URL, email)
	log.Println("Request url is: ", requestURL)
	req, err := http.NewRequest("GET", requestURL, nil)
	if err != nil {
		log.Fatalln(err)
		return JarvisResponse{}, err
	}

	req.Header.Add("Authorization", "Api-Key "+JARVIS_AUTH_TOKEN)
	resp, err := client.Do(req)
	if err != nil {
		log.Fatalln(err)
		return JarvisResponse{}, err
	}
	defer resp.Body.Close()

	if resp.StatusCode == http.StatusOK {
		bodyBytes, err := io.ReadAll(resp.Body)
		if err != nil {
			log.Println(err)
		}
		bodyString := string(bodyBytes)
		log.Println(bodyString)

		var data JarvisResponse

		err = json.Unmarshal([]byte(bodyBytes), &data)
		if err != nil {
			log.Println("Error:", err)
			return JarvisResponse{}, err
		}
		log.Println("Returning: ", data)

		return data, nil

	} else {
		return JarvisResponse{}, errors.New(fmt.Sprint("Jarvis responded with a status code: ", resp.Status))
	}

}

func jarvis_get_dentist_data(dentistID int) (*Dentist, error) {

	BASE_URL := os.Getenv("JARVIS_BASE_URL")

	apiKey := os.Getenv("JARVIS_AUTH_TOKEN")
	url := fmt.Sprintf("%sapi/smilewhite_app/dentist/%d/", BASE_URL, dentistID)

	log.Println(url)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Authorization", "Api-Key "+apiKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to make request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("received non-200 response code: %d", resp.StatusCode)
	}

	var response struct {
		ID      int `json:"id"`
		Address struct {
			Country      string `json:"country"`
			City         string `json:"city"`
			Region       string `json:"region"`
			Street       string `json:"street"`
			StreetNumber string `json:"street_number"`
		} `json:"address"`
		Name        string `json:"name"`
		Postcode    string `json:"postcode"`
		DentistUser int    `json:"dentist_user"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		return nil, fmt.Errorf("failed to decode response: %w", err)
	}

	dentist := &Dentist{
		JarvisID:     response.ID,
		Name:         response.Name,
		StreetNumber: response.Address.StreetNumber,
		Street:       response.Address.Street,
		City:         response.Address.City,
		Region:       response.Address.Region,
		Country:      response.Address.Country,
		Postcode:     response.Postcode,
	}

	return dentist, nil

}

type PatchResponse struct {
}

func jarvis_sign_medical_waiver(email string) error {
	BASE_URL := os.Getenv("JARVIS_BASE_URL")
	JARVIS_AUTH_TOKEN := os.Getenv("JARVIS_AUTH_TOKEN")

	log.Println("Updating terms accepted for user: ", email)

	client := &http.Client{}

	requestURL := fmt.Sprintf("%sapi/smilewhite_app/customer/%s/", BASE_URL, email)

	payload := map[string]bool{
		"terms_accepted": true,
	}
	jsonPayload, err := json.Marshal(payload)
	if err != nil {
		log.Println("Error marshalling payload: ", err)
		return err
	}

	req, err := http.NewRequest("PATCH", requestURL, bytes.NewBuffer(jsonPayload))
	if err != nil {
		log.Println("Error creating request: ", err)
		return err
	}

	req.Header.Add("Content-Type", "application/json")
	req.Header.Add("Authorization", "Api-Key "+JARVIS_AUTH_TOKEN)

	resp, err := client.Do(req)
	if err != nil {
		log.Println("Error executing request: ", err)
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode == http.StatusOK || resp.StatusCode == http.StatusNoContent {
		bodyBytes, err := io.ReadAll(resp.Body)
		if err != nil {
			log.Println("Error reading response body: ", err)
			return err
		}

		var data PatchResponse
		err = json.Unmarshal(bodyBytes, &data)
		if err != nil {
			log.Println("Error unmarshalling response: ", err)
			return err
		}

		log.Println("Successfully updated terms_accepted for user:", email)
		return nil
	} else {
		bodyBytes, _ := io.ReadAll(resp.Body)
		log.Println("Response body: ", string(bodyBytes))
		return errors.New(fmt.Sprintf("Jarvis responded with a status code: %d", resp.StatusCode))
	}
}

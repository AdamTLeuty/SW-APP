package main

import (
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

	//See: https://developers.hubspot.com/docs/api/crm/contacts
	//Add more properties under the `properties` url query if needed
	requestURL := BASE_URL + "api/smilewhite_app/customer?email=" + email
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

func jarvis_sign_medical_waiver(email string) error {

	return nil

}

// using SendGrid's Go Library
// https://github.com/sendgrid/sendgrid-go
package main

import (
	"log"
	"os"
	"strconv"

	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
)

func sendEmail(email string, authCode string) error {
	from := mail.NewEmail("Example User", "auth@app.smilecorrectclub.co.uk")

	to := mail.NewEmail("Example User", email)

	// Create a new message
	message := mail.NewV3Mail()

	// Set the from email
	message.SetFrom(from)

	// Add the recipient
	personalizations := mail.NewPersonalization()
	personalizations.AddTos(to)

	// Add dynamic template data (must match the variables used in the template)
	personalizations.SetDynamicTemplateData("name", "Testy")
	personalizations.SetDynamicTemplateData("auth_code", authCode)

	message.AddPersonalizations(personalizations)

	// Set the dynamic template ID
	message.SetTemplateID(os.Getenv("SENDGRID_AUTH_TEMPLATE_ID"))

	// Create the SendGrid client
	client := sendgrid.NewSendClient(os.Getenv("SENDGRID_API_KEY"))

	sendEmail, err := strconv.ParseBool(os.Getenv("SEND_EMAIL"))
	if err != nil {
		return err
	}
	if sendEmail {
		// Send the email
		response, err := client.Send(message)
		if err != nil {
			log.Fatal(err)
			return err
		} else {
			log.Println(response.StatusCode)
			log.Println(response.Body)
			log.Println(response.Headers)
			return nil
		}
	} else {
		//Do not send the email
		log.Println("Did not send confirmation email, as environment flag SEND_EMAIL set to false")
		return nil
	}

}

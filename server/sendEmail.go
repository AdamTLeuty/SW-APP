// using SendGrid's Go Library
// https://github.com/sendgrid/sendgrid-go
package main

import (
	"fmt"
	"log"
	"os"

	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
)

func sendEmail() {
	from := mail.NewEmail("Example User", "auth@app.smilecorrectclub.co.uk")

	to := mail.NewEmail("Example User", "adam.leuty@smilewhite.co.uk")

	// Create a new message
	message := mail.NewV3Mail()

	// Set the from email
	message.SetFrom(from)

	// Add the recipient
	personalizations := mail.NewPersonalization()
	personalizations.AddTos(to)

	// Add dynamic template data (must match the variables used in the template)
	personalizations.SetDynamicTemplateData("name", "Testy")
	personalizations.SetDynamicTemplateData("auth_code", "234567")

	message.AddPersonalizations(personalizations)

	// Set the dynamic template ID
	message.SetTemplateID(os.Getenv("SENDGRID_AUTH_TEMPLATE_ID"))

	// Create the SendGrid client
	client := sendgrid.NewSendClient(os.Getenv("SENDGRID_API_KEY"))

	// Send the email
	response, err := client.Send(message)
	if err != nil {
		log.Fatal(err)
	} else {
		fmt.Println(response.StatusCode)
		fmt.Println(response.Body)
		fmt.Println(response.Headers)
	}

}

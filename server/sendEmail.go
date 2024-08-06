package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/mailgun/mailgun-go/v4"
)

func sendEmail() {

	var yourDomain string = "app-auth.smilewhite.co.uk"

	//var privateAPIKey string = "REMOVED"
	var privateAPIKey string = "REMOVED"

	// Create an instance of the Mailgun Client
	mg := mailgun.NewMailgun(yourDomain, privateAPIKey)

	//When you have an EU-domain, you must specify the endpoint:
	mg.SetAPIBase("https://api.eu.mailgun.net/v3")

	sender := "sender@app-auth.smilewhite.co.uk"
	subject := "Fancy subject!"
	body := "Hello from Mailgun Go!"
	recipient := "adam.leuty@smilewhite.co.uk"

	// The message object allows you to add attachments and Bcc recipients
	message := mg.NewMessage(sender, subject, body, recipient)

	ctx, cancel := context.WithTimeout(context.Background(), time.Second*10)
	defer cancel()

	// Send the message with a 10 second timeout
	resp, id, err := mg.Send(ctx, message)

	if err != nil {
		log.Fatal(err)
	}

	fmt.Printf("ID: %s Resp: %s\n", id, resp)

	if err == nil {
		fmt.Println("Email sent successfully!")
		fmt.Println(id)
	} else {
		fmt.Println(err)
	}

}

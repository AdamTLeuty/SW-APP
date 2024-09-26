package main

import (
	"database/sql"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"
)

func notify(token string, title string, body string) {

	client := &http.Client{}

	var data = strings.NewReader(fmt.Sprintf(`{
		  	"to": "%s",
			"title": "%s",
			"body": "%s"
		}`, token, title, body))

	req, err := http.NewRequest("POST", "https://exp.host/--/api/v2/push/send", data)
	if err != nil {
		log.Fatal(err)
	}
	req.Header.Set("Content-Type", "application/json")
	resp, err := client.Do(req)
	if err != nil {
		log.Fatal(err)
	}
	defer resp.Body.Close()
	bodyText, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("%s\n", bodyText)

}

func getUserExpoToken(userID int, db *sql.DB) (string, error) {

	row, err := db.Query("SELECT expo_notification_token FROM users WHERE id = ?", userID)
	if err != nil {
		return "", err
	}
	defer row.Close()
	row.Next()
	var token string
	err = row.Scan(&token)
	if err != nil {
		return "", err
	}

	return token, nil

}

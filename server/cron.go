package main

import (
	"database/sql"
	"fmt"
	"log"
	"time"

	"github.com/robfig/cron/v3"
)

// Function that contains the task to be executed by the cron job
func sendAlignerChangeNotifications(loc *time.Location, db *sql.DB) {
	//loc, _ := time.LoadLocation("Europe/London")
	log.Println("Scheduled task executed at:", time.Now().In(loc))

	err := getUsersWithNowChangeDate(db)
	if err != nil {
		log.Println("Could not send user notifications:", err)
	} else {

		log.Println("Sent the user notifications successfully")

	}

}

// Function to set up the cron job
func setupCronJob(db *sql.DB) *cron.Cron {
	// Load timezone
	loc, err := time.LoadLocation("Europe/London")
	if err != nil {
		panic(err)
	}

	// Create a cron scheduler with the specified timezone
	c := cron.New(cron.WithLocation(loc))

	// Define the cron schedule (9:00 AM every day)
	//schedule := "0 8 * * *"

	// Define the cron schedule (Every minute)
	schedule := "0 8 * * *"

	// Add the task to the scheduler
	_, err = c.AddFunc(schedule, func() {
		sendAlignerChangeNotifications(loc, db)
	})
	if err != nil {
		panic(err)
	}

	// Start the cron scheduler in a goroutine
	go func() {
		log.Println("Cron scheduler started...")
		c.Start()
	}()

	return c
}

type idAndChangeDate struct {
	ID         int
	ChangeDate string
	Username   string
}

func getUsersWithNowChangeDate(db *sql.DB) error {

	rows, err := db.Query("SELECT id, alignerChangeDate, username FROM users")
	if err != nil {
		log.Fatal(err)
		return err
	}
	defer rows.Close()

	// An userum slice to hold data from returned rows.
	var users []idAndChangeDate

	// Loop through rows, using Scan to assign column data to struct fields.
	for rows.Next() {
		var user idAndChangeDate
		if err := rows.Scan(&user.ID, &user.ChangeDate, &user.Username); err != nil {
			log.Println(err)
			return err
		}
		users = append(users, user)
	}
	if err = rows.Err(); err != nil {
		log.Println(err)
		return err
	}

	today := time.Now().UTC().Truncate(24 * time.Hour) //Today, rounded back to midnight

	for _, user := range users {
		changeDate, err := time.Parse(time.RFC3339, user.ChangeDate)
		if err != nil {
			log.Println("Couldn't send notification: ", err)
		}
		changeDate = changeDate.UTC().Truncate(24 * time.Hour)

		if changeDate == today {
			//Send this user a notification
			token, err := getUserExpoToken(user.ID, db)
			if err != nil {
				return err
			}

			message := fmt.Sprintf("%s, its time to change your aligners!", user.Username)

			notify(token, "Smile Correct Club", message)
		}
	}

	return nil

}

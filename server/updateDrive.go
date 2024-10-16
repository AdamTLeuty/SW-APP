package main

import (
	"log"
	"os/exec"
)

func updateDrive() {

	log.Println("Sending to google drive")

	app := "rclone"

	arg0 := "copy"
	arg1 := "./images/"
	arg2 := "remote-SCC:/Smile Correct Club/App Uploads"

	cmd := exec.Command(app, arg0, arg1, arg2)
	stdout, err := cmd.Output()

	if err != nil {
		log.Println(err.Error())
		return
	}

	// Print the output
	log.Println(string(stdout))
	log.Println("Should have sent to google drive now")
}

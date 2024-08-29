package main

import (
	"fmt"
	"os/exec"
)

func updateDrive() {

	fmt.Println("Sending to google drive")

	app := "rclone"

	arg0 := "copy"
	arg1 := "./images/"
	arg2 := "remote-SCC:/Smile Correct Club/App Uploads"

	cmd := exec.Command(app, arg0, arg1, arg2)
	stdout, err := cmd.Output()

	if err != nil {
		fmt.Println(err.Error())
		return
	}

	// Print the output
	fmt.Println(string(stdout))
	fmt.Println("Should have sent to google drive now")
}

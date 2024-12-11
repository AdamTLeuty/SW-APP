package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type UserDataRequest struct {
	Stage         string `json:"stage,omitempty"`
	Username      string `json:"username,omitempty"`
	ExpoPushToken string `json:"expoPushToken,omitempty"`
	Aligner_Count int    `json:"aligner_count,omitempty"`
}

type UserDataResponse struct {
	Stage                  string `json:"stage,omitempty"`
	Username               string `json:"username,omitempty"`
	ImpressionConfirmation string `json:"impressionConfirmation,omitempty"`
	AlignerCount           int    `json:"alignerCount,omitempty"`
	AlignerProgress        int    `json:"alignerProgress"`
	AlignerChangeDate      string `json:"alignerChangeDate,omitempty"`
	ExpoPushToken          string `json:"expoPushToken,omitempty"`
	CanChangeStage         bool   `json:"canChangeStage,omitempty"`
	MedicalWaiverSigned    bool   `json:"medicalWaiverSigned,omitempty"`
}

func getUserData(c *gin.Context, db *sql.DB) {

	email := c.GetString("email")

	//Check if user exists in database
	emailInDB, err := checkEmailExists(db, email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Cannot verify user exists - please try again later"})
		return
	}
	if !emailInDB {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Cannot get user data - no such user exists"})
		return
	}

	go updateUserFromHubspotData(db, email)

	var userData UserDataResponse

	err = db.QueryRow(`SELECT stage, username, impressionConfirmation, alignerProgress, alignerCount, alignerChangeDate, can_change_stage, medical_waiver_signed FROM users WHERE email = ?`, email).Scan(&userData.Stage, &userData.Username, &userData.ImpressionConfirmation, &userData.AlignerProgress, &userData.AlignerCount, &userData.AlignerChangeDate, &userData.CanChangeStage, &userData.MedicalWaiverSigned)
	if err != nil {
		log.Println("Error scanning for user data: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching user data - please try again later"})
		return
	}
	log.Println(userData)

	c.JSON(http.StatusOK, gin.H{"message": "User data fetched", "userData": userData})
}

func updateUserFromHubspotData(db *sql.DB, email string) error {

	//Check hubspot for aligner count
	data, err := getUserHubspotData(email)
	if err != nil {
		return err
	}

	//Update aligner count if available
	if data.Aligner_Count > 0 {
		var changeData UserDataRequest
		changeData.Aligner_Count = data.Aligner_Count
		updateUserData(db, email, changeData)
	}

	hubspotUserStage, err := hubspotStageToUserStage(data.Process_Stage)
	if err != nil {
		return err
	}
	if hubspotUserStage == "Aligner" {
		setUserCanChangeStage(email, db)
	}

	return nil
}

func updateUserFromJarvisDB(db *sql.DB, email string) error {
	data, err := jarvis_get_customer_data(email)
	if err != nil {
		log.Println("Could not fetch jarvis data:", err)
		return err
	}
	log.Println(data)

	stmt, err := db.Prepare(`
		UPDATE users SET medical_waiver_signed = ? WHERE email = ?
	`)
	if err != nil {
		log.Println("Prepare failed:", err)
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(data.TermsAccepted, email)
	if err != nil {
		log.Println("Execution failed:", err)
		return err
	}
	return nil
}

func updateUserFromJarvisTx(tx *sql.Tx, email string) error {
	data, err := jarvis_get_customer_data(email)
	if err != nil {
		log.Println("Could not fetch jarvis data:", err)
		return err
	}
	log.Println(data)

	stmt, err := tx.Prepare(`
		UPDATE users SET medical_waiver_signed = ? WHERE email = ?
	`)
	if err != nil {
		log.Println("Prepare failed:", err)
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(data.TermsAccepted, email)
	if err != nil {
		log.Println("Execution failed:", err)
		return err
	}
	return nil
}

func setUserData(c *gin.Context, db *sql.DB) {

	email := c.GetString("email")

	//Read the request data
	var requestData UserDataRequest
	if err := c.ShouldBindJSON(&requestData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	//Check if user exists in database
	emailInDB, err := checkEmailExists(db, email)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Cannot verify user exists - please try again later"})
		return
	}
	if !emailInDB {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Cannot set user data - no such user exists"})
		return
	}

	/*if requestData.Stage != "" {
	log.Println("The user is changing stages")
	userChangingStage, err := checkUserChangingStage(db, requestData.Stage, email)
	if userChangingStage && err == nil {
		go userStageUpdate(db, email)
	}

	}*/

	err = updateUserData(db, email, requestData)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err})
	} else {
		c.JSON(http.StatusOK, gin.H{"message": "User data updated"})
	}

}

func checkUserChangingStage(db *sql.DB, stage string, email string) (bool, error) {

	currentStage, err := getUserStage(db, email)
	if err != nil {
		log.Println("Cannot check the user is changing stage")
		return false, err
	}

	log.Println("Current stage: ", currentStage)

	return (currentStage == "impression" && stage == "aligner"), nil
}

func getUserStage(db *sql.DB, email string) (string, error) {
	row, err := db.Query("SELECT stage FROM users WHERE email = ?", email)
	if err != nil {
		return "", err
	}
	defer row.Close()
	row.Next()
	var stage string
	err = row.Scan(&stage)
	if err != nil {
		return "", err
	}

	return stage, nil
}

func userStageUpdate(db *sql.DB, email string) {
	log.Println("\nUser stage update function\n")

	//Check hubspot for aligner count
	data, err := getUserHubspotData(email)
	log.Println(data, err)

	//Update aligner count if available
	if data.Aligner_Count > 0 {

		var changeData UserDataRequest

		changeData.Aligner_Count = data.Aligner_Count

		updateUserData(db, email, changeData)
	}

	hubspotUserStage, err := hubspotStageToUserStage(data.Process_Stage)
	if err != nil {
		log.Println("Could not parse hubspot stage : ", err)
		return
	}
	if hubspotUserStage == "Aligner" {
		setUserCanChangeStage(email, db)
	}

}

func hubspotStageToUserStage(hubspotStage string) (string, error) {

	fieldMap := map[string]string{
		"Impression Kit Dispatched":               "Impression",
		"Impression Kit Received":                 "Impression",
		"Impression Kit Not Received":             "Impression",
		"Impression Kit Lost In Transit":          "Impression",
		"Impression Quality: Failed":              "Impression",
		"Impression Quality: Passed":              "Impression",
		"Lab Pending Receipt of Impression Kit":   "Impression",
		"Lab: Kit Received":                       "Impression",
		"Lab: Kit Not Received":                   "Impression",
		"Lab: Lost In Transit":                    "Impression",
		"Treatment Plan Created":                  "Impression",
		"Treatment Plan Approved by Client":       "Impression",
		"Treatment Plan Declined by Client":       "Impression",
		"Treatment Plan Refined":                  "Impression",
		"Medical Waiver Sent (pending signature)": "Impression",
		"Medical Waiver Signed":                   "Impression",
		"Aligners Being Manufactured":             "Impression",
		"Aligners Dispatched":                     "Aligner",
		"Client Informed Treatment Dispatched":    "Aligner",
		"Pending":                                 "Impression",
		"Client Received Treatment":               "Aligner",
		"Client Not Received Treatment":           "Aligner",
		"Cancellation Requested":                  "Aligner",
		"Refund Due":                              "Aligner",
		"Refund Paid":                             "Aligner",
		"No Refund Due":                           "Impression",
		"Client Informed - No Refund":             "Impression",
		"Ordering Impression Kit":                 "Impression",
		"Re-order Impression Kit":                 "Impression",
		"Walkthrough Complete":                    "Impression",
		"Lab: Scans Complete":                     "Impression",
		"ALS: Scans Received":                     "Impression",
		"ALS: Treatment Plan In-progress":         "Impression",
		"ALS: Treatment Plan Completed":           "Impression",
		"ALS: Being Manufactured":                 "Impression",
		"ALS: Treatment Dispatched to Client":     "Impression",
		"ALS: Pending Scan Retrieval":             "Impression",
		"ALS: Plan Agreed":                        "Impression",
		"Walkthrough Skipped":                     "Aligner",
		"ALS: Treatment Dispatched to SW":         "Impression",
		"Treatment Dispatched to Client":          "Aligner",
		"Refinements Needed":                      "Aligner",
		"Refinement Impressions Passed":           "Aligner",
		"Refinement Impressions Failed":           "Aligner",
		"Refinement Plan Created":                 "Impression",
		"Refinement Plan Approved":                "Aligner",
		"Refinement Plan Not Approved":            "Aligner",
		"Refinements Being Manufactured":          "Aligner",
		"Refinements Dispatched":                  "Aligner",
		"Refinements Aligners Sent To Customer":   "Aligner",
		"Refinements Dispatched To Client":        "Aligner",
		"Re-Order Refinement Impression Kit":      "Aligner",
		"PLAN APPROVED OLD FLOW":                  "Impression",
		"Medical Waiver Signed OLD FLOW":          "Impression",
		"FINAL SIGN OFF OLD FLOW":                 "Impression",
		"SIGNED OFF OLD FLOW":                     "Impression",
		"Manufacture Aligners OLD FLOW":           "Impression",
		"Impressions Failed Second Attempt":       "Impression",
		"Impressions Passed Second Attempt":       "Impression",
		"Signed Off":                              "Impression",
		"ALS: Treatment Plan Generated":           "Impression",
	}

	if fieldMap[hubspotStage] == "" {
		return "", fmt.Errorf("Hubspot stage not in fieldmap")
	} else {
		return fieldMap[hubspotStage], nil
	}
}

func setUserCanChangeStage(email string, db *sql.DB) error {
	stmt, err := db.Prepare("UPDATE users SET can_change_stage = ? WHERE email = ?")
	if err != nil {
		log.Println("database failed: ", err)
		return err
	}

	_, err = stmt.Exec(1, email)
	if err != nil {
		log.Println("execution failed: ", err)
		return err
	}
	return nil
}

func checkUserCanChangeStage(email string, db *sql.DB) (bool, error) {
	var canChangeStage bool
	err := db.QueryRow("SELECT can_change_stage FROM users WHERE email = ?", email).Scan(&canChangeStage)
	if err != nil {
		return false, err
	}
	return true, nil
}

func updateUserData(db *sql.DB, email string, request UserDataRequest) error {
	//Updates user data based on which members of request are populated
	log.Println("\n Updating user data function")

	var (
		args      []any
		setString = "SET "
	)

	log.Println(request)

	fields := map[string]any{
		"stage":                   request.Stage,
		"username":                request.Username,
		"expo_notification_token": request.ExpoPushToken,
		"alignerCount":            request.Aligner_Count,
	}

	for field, value := range fields {

		if field == "stage" {
			canMoveStages, err := checkUserCanChangeStage(email, db)
			if err != nil || !canMoveStages {
				log.Println("Did not change user stage, user cannot change stage:", err)
				continue
			}
		}

		if field == "alignerCount" && value.(int) <= 0 {
			log.Print("Did not change aligner count value, as aligner count is not positive")
			continue
		}
		if value != "" {
			if len(args) > 0 {
				setString += ", "
			}
			setString += field + " = ?"
			args = append(args, value)
		}
	}

	log.Println(request)

	//Join the SET clause into the query
	query := fmt.Sprintf("UPDATE users %s WHERE email = ?", setString)
	log.Println("The final query is: ", query)

	stmt, err := db.Prepare(query)
	if err != nil {
		log.Println("database failed: ", err)
		return err
	}

	args = append(args, email)

	log.Println(args...)

	_, err = stmt.Exec(args...)
	if err != nil {
		log.Println("execution failed: ", err)
		return err
	}
	return nil

}

type ChangeDateRequest struct {
	DelayChange bool `json:"delayChange,omitempty"`
}

func updateAlignerChangeDate(c *gin.Context, db *sql.DB) {

	//Get email from context
	email := c.GetString("email")
	log.Println("Updating aligner change date for ", email)

	//Read the request data
	var requestData ChangeDateRequest
	if err := c.ShouldBindJSON(&requestData); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	log.Println(requestData)

	//Get current change date from db
	var currentAlignerChangeDateString string
	err := db.QueryRow("SELECT alignerChangeDate FROM users WHERE email = ?", email).Scan(&currentAlignerChangeDateString)
	if err != nil {
		log.Println("Error scanning for user data: ", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching user data - please try again later"})
		return
	}
	log.Println("The current change date in db is: ", currentAlignerChangeDateString)

	//Convert from string to datetime object
	currentAlignerChangeDate, err := time.Parse(time.RFC3339, currentAlignerChangeDateString)
	if err != nil {
		log.Println("Error parsing date:", err)
		return
	}

	//If alignerChangeDate is in the future, do not allow to change
	today := time.Now().UTC().Truncate(24 * time.Hour) //Today, rounded back to midnight
	if currentAlignerChangeDate.After(today) {
		log.Println("The aligner change date is in the future")
		c.JSON(http.StatusBadRequest, gin.H{"error": "The aligner change date is in the future, cannot change aligners yet"})
		return
	}

	var newChangeDate time.Time

	if requestData.DelayChange {
		//If delay change, make alignerChangeDate tomorrow
		newChangeDate = today.AddDate(0, 0, 1)
		println(newChangeDate.Format(time.RFC3339))
	} else {
		//Else, make alignerChangeDate +10 days from now
		newChangeDate = today.AddDate(0, 0, 10)
		println(newChangeDate.Format(time.RFC3339))

		err = moveToNextAligner(db, email)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error, please try again later"})
			return
		}
	}

	err = updateUserAlignerDateChange(db, email, newChangeDate.Format(time.RFC3339))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error, please try again later"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated aligner change date successfully", "newDate": newChangeDate.Format(time.RFC3339)})
}

func updateUserAlignerDateChange(db *sql.DB, email string, date string) error {
	//Changing the user's authcode
	stmt, err := db.Prepare("UPDATE users SET alignerChangeDate = ? WHERE email = ?")
	if err != nil {
		log.Println("database failed: ", err)
		return err
	}
	_, err = stmt.Exec(date, email)
	if err != nil {
		log.Println("execution failed: ", err)
		return err
	}

	return nil
}

func moveToNextAligner(db *sql.DB, email string) error {
	//Fetch the aligner progress value
	var alignerProgress int
	err := db.QueryRow("SELECT alignerProgress FROM users WHERE email = ?", email).Scan(&alignerProgress)
	if err != nil {
		log.Println("Error scanning for user data: ", err)
		return err
	}
	log.Println("The current change date in db is: ", alignerProgress)

	//Increment the aligner progress value
	alignerProgress++

	//Update the value
	stmt, err := db.Prepare("UPDATE users SET alignerProgress = ? WHERE email = ?")
	if err != nil {
		log.Println("database failed: ", err)
		return err
	}
	_, err = stmt.Exec(alignerProgress, email)
	if err != nil {
		log.Println("execution failed: ", err)
		return err
	}

	return nil
}

package main

import (
	"fmt"
	"log"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

var secretKey = []byte("REMOVED")

func createToken(email string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256,
		jwt.MapClaims{
			"email": email,
			"exp":   time.Now().Add(time.Hour * 2).Unix(),
		})

	tokenString, err := token.SignedString(secretKey)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func verifyToken(tokenString string) (interface{}, error) {

	claimKey := "email"

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		log.Printf("Secret key is: %s\n", secretKey)
		return []byte(secretKey), nil
	})

	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, fmt.Errorf("invalid token")
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		if claimValue, ok := claims[claimKey]; ok {
			return claimValue, nil
		}
		return nil, fmt.Errorf("claim %s not found in token", claimKey)
	}

	return nil, fmt.Errorf("could not extract claims from token")
}

package auth

import (
	"fmt"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

var jwtSecret = []byte(os.Getenv("JWT_SECRET"))

type Claims struct {
	UserID primitive.ObjectID `json:"user_id"`
	Email  string             `json:"email"`
	jwt.RegisteredClaims
}

func GenerateJWT(userID primitive.ObjectID, email string) (string, error) {
	expirationTime := time.Now().AddDate(0, 3, 0)

	claims := &Claims{
		UserID: userID,
		Email:  email,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime), // This handles proper timestamp format
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}
func ParseJWT(tokenString string) (*Claims, error) {
	// Add debug print
	fmt.Printf("Token being parsed: %s\n", tokenString)

	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		// Verify the signing method
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return jwtSecret, nil
	})

	if err != nil {
		// Print the specific error
		fmt.Printf("JWT parsing error: %v\n", err)
		return nil, err
	}

	if !token.Valid {
		fmt.Println("Token is invalid")
		return nil, jwt.ErrSignatureInvalid
	}

	return claims, nil
}

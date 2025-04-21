package controllers

import (
	"context"
	"fmt"
	"go_backend/auth"
	"go_backend/models"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

type UserResponseWithoutPassword struct {
	ID        primitive.ObjectID `json:"id"`
	FirstName string             `json:"first_name"`
	LastName  string             `json:"last_name"`
	Email     string             `json:"email"`
	CreatedAt time.Time          `json:"createdAt"`
	UpdatedAt time.Time          `json:"updatedAt"`
}

func Login(c *fiber.Ctx) error {
	var input struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.BodyParser(&input); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request"})
	}

	cleanPassword := strings.TrimSpace(input.Password)

	var user models.User
	err := userCollection.FindOne(context.Background(), bson.M{"email": input.Email}).Decode(&user)
	if err != nil {
		fmt.Printf("User not found: %v\n", err)
		return c.Status(401).JSON(fiber.Map{"error": "Invalid credentials"})
	}

	// Compare passwords
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(cleanPassword))
	if err != nil {
		return c.Status(401).JSON(fiber.Map{"error": "Invalid credentials"})
	}

	// Generate JWT token
	token, err := auth.GenerateJWT(user.ID, user.Email)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not generate token",
		})
	}

	return c.JSON(fiber.Map{
		"token": token,
		"user": UserResponseWithoutPassword{
			ID:        user.ID,
			FirstName: user.FirstName,
			LastName:  user.LastName,
			Email:     user.Email,
			CreatedAt: user.CreatedAt,
			UpdatedAt: user.UpdatedAt,
		},
	})
}

func Logout(c *fiber.Ctx) error {
	authHeader := c.Get("Authorization")
	if authHeader == "" {
		return c.Status(401).JSON(fiber.Map{"error": "Not authenticated"})
	}

	tokenString := strings.TrimPrefix(authHeader, "Bearer ")
	fmt.Printf("Token received for logout: %s\n", tokenString)

	// First verify the token is valid before invalidating
	claims, err := auth.ParseJWT(tokenString)
	if err != nil {
		fmt.Printf("Logout token validation failed: %v\n", err)
		return c.Status(401).JSON(fiber.Map{
			"error":   "Invalid token",
			"details": err.Error(), // Include the actual error message
		})
	}

	auth.InvalidateToken(tokenString)
	fmt.Printf("Token invalidated for user %s\n", claims.UserID)

	return c.JSON(fiber.Map{
		"message": "Successfully logged out",
		"user_id": claims.UserID,
	})
}

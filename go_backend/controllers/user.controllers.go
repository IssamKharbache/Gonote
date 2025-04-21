package controllers

import (
	"context"
	"go_backend/config"
	"go_backend/models"
	"strings"
	"time"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

var userCollection = config.GetUserCollection()

type UserResponse struct {
	ID        primitive.ObjectID `json:"id"`
	FirstName string             `json:"first_name"`
	LastName  string             `json:"last_name"`
	Email     string             `json:"email"`
	Password  string             `json:"password"`
	CreatedAt time.Time          `json:"createdAt"`
	UpdatedAt time.Time          `json:"updatedAt"`
}

func Get_users(c *fiber.Ctx) error {
	cursor, err := userCollection.Find(context.Background(), bson.M{})
	if err != nil {
		return err
	}
	defer cursor.Close(context.Background())
	var users []models.User
	for cursor.Next(context.Background()) {
		var user models.User
		if err := cursor.Decode(&user); err != nil {
			return err
		}
		users = append(users, user)
	}

	return c.Status(201).JSON(users)
}

func Create_user(c *fiber.Ctx) error {
	user := new(models.User)

	// Parse request body
	if err := c.BodyParser(user); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid request body",
		})
	}

	// Trim and validate inputs
	user.ID = primitive.NewObjectID()
	user.Email = strings.TrimSpace(user.Email)
	user.Password = strings.TrimSpace(user.Password)
	user.FirstName = strings.TrimSpace(user.FirstName)
	user.LastName = strings.TrimSpace(user.LastName)

	// Basic validation
	if user.Email == "" || user.Password == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Email and password are required",
		})
	}

	// Set timestamps
	now := time.Now()
	user.CreatedAt = now
	user.UpdatedAt = now

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to process password",
		})
	}
	user.Password = string(hashedPassword)

	// Insert user
	_, err = userCollection.InsertOne(context.Background(), user)
	if err != nil {
		// Check for duplicate key error (unique email violation)
		if mongo.IsDuplicateKeyError(err) {
			return c.Status(fiber.StatusConflict).JSON(fiber.Map{
				"error": "Email already exists",
			})
		}

		// Handle other database errors
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to create user",
		})
	}

	// Return success response (without password)
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"id":         user.ID,
		"first_name": user.FirstName,
		"last_name":  user.LastName,
		"email":      user.Email,
		"created_at": user.CreatedAt,
		"updated_at": user.UpdatedAt,
	})
}

func GetCurrentUser(c *fiber.Ctx) error {
	// Safely get userID from context
	userID, ok := c.Locals("userID").(string)
	if !ok {
		return c.Status(500).JSON(fiber.Map{
			"error": "User ID not found in context",
		})
	}

	// Convert string ID to ObjectID
	objID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{
			"error": "Invalid user ID format",
		})
	}

	// Fetch user from database
	var user models.User
	err = userCollection.FindOne(context.Background(), bson.M{"_id": objID}).Decode(&user)
	if err != nil {
		return c.Status(404).JSON(fiber.Map{
			"error": "User not found",
		})
	}

	// Return user data (excluding password)
	return c.JSON(fiber.Map{
		"id":         user.ID.Hex(),
		"email":      user.Email,
		"first_name": user.FirstName,
		"last_name":  user.LastName,
		"created_at": user.CreatedAt,
	})
}

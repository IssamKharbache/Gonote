package controllers

import (
	"context"
	"fmt"
	"go_backend/config"
	"go_backend/models"
	"time"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

var userCollection = config.GetUserCollection()

type UserResponse struct {
	ID        primitive.ObjectID `json:"id"`
	FirstName string             `json:"first_name"`
	LastName  string             `json:"last_name"`
	Email     string             `json:"email"`
	CreatedAt time.Time          `json:"createdAt"`
	UpdatedAt time.Time          `json:"updatedAt"`
}

func Get_user(c *fiber.Ctx) error {
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

	if err := c.BodyParser(user); err != nil {
		return err
	}
	if user.FirstName == "" || user.LastName == "" || user.Email == "" || user.Password == "" {
		fmt.Println(user.Password)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "All fields (first name, last name, email, password) are required",
		})
	}

	user.ID = primitive.NewObjectID()

	user.CreatedAt = time.Now()
	user.UpdatedAt = time.Now()
	//hashing the password before inserting the new user
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to hash password",
		})
	}
	user.Password = string(hashedPassword)
	//creating new user
	_, err = userCollection.InsertOne(context.Background(), user)

	if err != nil {
		return err
	}

	response := UserResponse{
		ID:        user.ID,
		FirstName: user.FirstName,
		LastName:  user.LastName,
		Email:     user.Email,
		CreatedAt: user.CreatedAt,
		UpdatedAt: user.UpdatedAt,
	}

	return c.Status(201).JSON(response)
}

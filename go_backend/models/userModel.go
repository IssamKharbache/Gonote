package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID        primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	FirstName string             `json:"first_name" validate:"required"`
	LastName  string             `json:"last_name" validate:"required"`
	Email     string             `json:"email" validate:"required,email"`
	Password  string             `json:"password" validate:"required,min=6"`
	CreatedAt time.Time          `json:"created_at"`
	UpdatedAt time.Time          `json:"updated_at"`
}

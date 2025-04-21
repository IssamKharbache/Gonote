package controllers

import (
	"context"
	"fmt"

	"go_backend/config"
	"go_backend/models"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

var todoCollection = config.GetTodoCollection()

func GetTodos(c *fiber.Ctx) error {
	cursor, err := todoCollection.Find(context.Background(), bson.M{})
	if err != nil {
		return err
	}
	defer cursor.Close(context.Background())

	var todos []models.Todo
	for cursor.Next(context.Background()) {
		var todo models.Todo
		if err := cursor.Decode(&todo); err != nil {
			return err
		}
		todos = append(todos, todo)
	}

	return c.JSON(todos)
}

func CreateTodo(c *fiber.Ctx) error {
	todo := new(models.Todo)
	if err := c.BodyParser(todo); err != nil {
		return err
	}

	if todo.Body == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Todo content is required"})
	}

	todo.ID = primitive.NewObjectID()

	_, err := todoCollection.InsertOne(context.Background(), todo)
	if err != nil {
		return err
	}

	return c.Status(201).JSON(todo)
}

func UpdateTodo(c *fiber.Ctx) error {
	id := c.Params("id")
	objectId, err := primitive.ObjectIDFromHex(id)

	if err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Invalid todo id"})
	}

	var result models.Todo
	filter := bson.M{"_id": objectId}
	err = todoCollection.FindOne(context.Background(), filter).Decode(&result)

	if err != nil {
		return err
	}

	update := bson.M{"$set": bson.M{"completed": !result.Completed}}

	_, err = todoCollection.UpdateOne(context.Background(), filter, update)

	if err != nil {
		return err
	}
	return c.Status(200).JSON(fiber.Map{"success": true, "message": "Todo updated successfully"})
}

// update content of todo
func UpdateTodoContent(c *fiber.Ctx) error {
	todo := new(models.Todo)
	if err := c.BodyParser(todo); err != nil {
		return err
	}

	if err := c.BodyParser(todo); err != nil {
		return err
	}
	id := c.Params("id")
	objectId, err := primitive.ObjectIDFromHex(id)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid todo id"})
	}

	filter := bson.M{"_id": objectId}
	update := bson.M{"$set": bson.M{"body": todo.Body}}

	_, err = todoCollection.UpdateOne(context.Background(), filter, update)

	if err != nil {
		return err
	}
	return c.Status(200).JSON(fiber.Map{"success": true, "message": "Todo updated successfully"})

}

// delete todo handler
func DeleteTodo(c *fiber.Ctx) error {
	id := c.Params("id")
	objectId, err := primitive.ObjectIDFromHex(id)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid todo id"})
	}

	filter := bson.M{"_id": objectId}

	_, err = todoCollection.DeleteOne(context.Background(), filter)

	if err != nil {
		return err
	}

	return c.Status(200).JSON(fiber.Map{"success": true, "message": "Todo deleted successfully"})

}

// get todo based on id handler

func GetUserTodos(c *fiber.Ctx) error {
	id := c.Params("id")
	// Assuming id is a string, no need to convert to ObjectID
	fmt.Println("Looking for todos of user:", id)

	filter := bson.M{"user_id": id}
	cursor, err := todoCollection.Find(context.Background(), filter)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch todos"})
	}
	defer cursor.Close(context.Background())

	var todos []models.Todo
	if err := cursor.All(context.Background(), &todos); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to decode todos"})
	}

	// If no todos are found, return an empty array
	if len(todos) == 0 {
		return c.Status(200).JSON([]models.Todo{})
	}

	return c.Status(200).JSON(todos)
}

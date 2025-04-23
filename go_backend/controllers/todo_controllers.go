package controllers

import (
	"context"
	"strconv"
	"strings"
	"time"

	"go_backend/config"
	"go_backend/models"

	"github.com/gofiber/fiber/v2"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
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

	if todo.UserID == "" {
		return c.Status(400).JSON(fiber.Map{"error": "You are not authenticated"})

	}

	if todo.Body == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Todo content is required"})
	}

	todo.ID = primitive.NewObjectID()
	todo.Body = strings.ToLower(todo.Body)
	todo.CreatedAt = time.Now()
	todo.UpdatedAt = time.Now()

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

	id := c.Params("id")
	objectId, err := primitive.ObjectIDFromHex(id)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid todo id"})
	}

	//initalizing the todo
	todo := new(models.Todo)
	if err := c.BodyParser(todo); err != nil {
		return err
	}
	if todo.Body == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Todo content is required"})
	}

	//fetching that todo from database
	var existingTodo models.Todo
	err = todoCollection.FindOne(context.Background(), bson.M{"_id": objectId}).Decode(&existingTodo)
	if err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "Todo not found"})
	}
	//checking if the body content is as same as before
	if todo.Body == existingTodo.Body {
		return c.Status(400).JSON(fiber.Map{"error": "Todo content is same as before"})
	}
	//getting the user id from the locals
	userID := c.Locals("userID")
	//checking if the user id is nil
	if userID == nil {
		return c.Status(401).JSON(fiber.Map{"error": "Unauthorized"})
	}
	//checking if the user id is same as the one in the todo
	if existingTodo.UserID != userID.(string) {
		return c.Status(403).JSON(fiber.Map{"error": "You are not authorized to update this todo"})
	}

	//filters
	filter := bson.M{"_id": objectId}
	//update
	update := bson.M{"$set": bson.M{"body": todo.Body}}

	//updating the content
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

	// Parse page and limit query parameters with fallback defaults
	page, err := strconv.Atoi(c.Query("page", "1"))

	if err != nil || page < 1 {
		page = 1
	}

	limit, err := strconv.Atoi(c.Query("limit", "10"))

	if err != nil || limit < 1 {
		limit = 10
	}

	skip := (page - 1) * limit

	filter := bson.M{"userid": id}
	opts := options.Find().SetLimit(int64(limit)).SetSkip(int64(skip)).SetSort(bson.D{{Key: "_id", Value: -1}})

	cursor, err := todoCollection.Find(context.Background(), filter, opts)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to fetch todos"})
	}
	defer cursor.Close(context.Background())

	var todos []models.Todo
	if err := cursor.All(context.Background(), &todos); err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to decode todos"})
	}

	return c.Status(200).JSON(todos)
}

func DeleteTodaysCompletedTodos(c *fiber.Ctx) error {
	// Get today's date at midnight (start of day)

	// Delete all completed todos from today
	result, err := todoCollection.DeleteMany(c.Context(), bson.M{"completed": true})

	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error":   "Failed to delete today's completed todos",
			"details": err.Error(),
		})
	}

	return c.JSON(fiber.Map{"success": true, "result": result})
}

package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type Todo struct {
	ID primitive.ObjectID `json:"_id,omitempty" bson:"_id,omitempty"`
	Completed bool `json:"completed"`
	Body string  `json:"body"`
}

var collection *mongo.Collection


func main(){
	fmt.Println("starting server")

	err := godotenv.Load(".env")

	if err != nil {
		log.Fatal("Error while trying to load .env file")
	}

	mongodbUri := os.Getenv("MONGODB_URI")

	clientOptions := options.Client().ApplyURI(mongodbUri)
	client,err := mongo.Connect(context.Background(),clientOptions)

	if err != nil {
		log.Fatal(err)
	}
    
	defer client.Disconnect(context.Background())


	err = client.Ping(context.Background(),nil)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Connected to mongo db successfully")

	collection = client.Database("tastTide").Collection("todos")

	app := fiber.New()
   
	//setting up cors

	app.Use(cors.New(cors.Config{
		AllowOrigins: os.Getenv("FRONT_END_URL"),
		AllowHeaders: "Origin,Content-Type,Accept",
	}))

    //get all todo route
	app.Get("/api/todos",getTodos)
	//get a todo based on it id
	 app.Get("/api/todo/:id",getTodo)
	//create todo route
	app.Post("/api/todos/create",createTodo)
	//update todo route
	app.Patch("/api/todos/update/:id",updateTodo)
	//delete todo route
	 app.Delete("/api/todos/delete/:id",deleteTodo)


	port := os.Getenv("PORT")

	if port == "" {
		port = "4000"
	}

	log.Fatal(app.Listen("0.0.0.0:"+port))

}



//get all todos
func getTodos(c *fiber.Ctx) error {
   var todos []Todo

   cursor,err := collection.Find(context.Background(),bson.M{})

   if err != nil {
	return err
}

defer cursor.Close(context.Background())
for cursor.Next(context.Background()){
	var todo Todo
	if err := cursor.Decode(&todo); err != nil {
		return err
	}
	todos = append(todos,todo)
}
return c.JSON(todos)
}

//create todo handler
func createTodo(c *fiber.Ctx) error {
	todo := new(Todo)
	if err:= c.BodyParser(todo);err != nil {
		return err
	}

	if todo.Body == "" {
		return c.Status(400).JSON(fiber.Map{"error":"Todo content is required"})
	}
	insertResult,err := collection.InsertOne(context.Background(),todo)
	if err != nil {
		return err
	}
	todo.ID = insertResult.InsertedID.(primitive.ObjectID)

	return c.Status(201).JSON(todo)

}

//update todo handler
func updateTodo(c *fiber.Ctx) error {
	id := c.Params("id")
	objectId,err := primitive.ObjectIDFromHex(id)


	if err != nil {
		return c.Status(404).JSON(fiber.Map{"error":"Invalid todo id"})
	}

	
	var result Todo
    filter := bson.M{"_id":objectId}
	err  = collection.FindOne(context.Background(),filter).Decode(&result)

	if err != nil {
		return err
	}

	update := bson.M{"$set":bson.M{"completed":!result.Completed}}

	_, err = collection.UpdateOne(context.Background(),filter,update)

	if err != nil {
		return err
	}
	return c.Status(200).JSON(fiber.Map{"success":true,"message":"Todo updated successfully"})
}

//delete todo handler
func deleteTodo(c *fiber.Ctx) error {
	id := c.Params("id")
	objectId,err := primitive.ObjectIDFromHex(id)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error":"Invalid todo id"})
	}

	filter := bson.M{"_id":objectId}

	_,err = collection.DeleteOne(context.Background(),filter)

	if err != nil{
		return err
	}

	return c.Status(200).JSON(fiber.Map{"success":true,"message":"Todo deleted successfully"})
	

}

//get todo based on id handler
func getTodo(c *fiber.Ctx) error {
	id := c.Params("id")
	objectId,err := primitive.ObjectIDFromHex(id)

	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error":"Invalid todo id"})
	}
	var result Todo
	filter := bson.M{"_id":objectId}

	err  = collection.FindOne(context.Background(),filter).Decode(&result)

	if err != nil {
		return err
	}
	
	return c.Status(200).JSON(result)
 }
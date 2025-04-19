package config

import (
	"context"
	"log"
	"os"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var DB *mongo.Client

func ConnectDB() *mongo.Client {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatal("Failed to load .env")
	}

	mongoURI := os.Getenv("MONGODB_URI")

	clientOptions := options.Client().ApplyURI(mongoURI)
	client, err := mongo.Connect(context.TODO(), clientOptions)

	if err != nil {
		log.Fatal(err)
	}

	err = client.Ping(context.TODO(), nil)
	if err != nil {
		log.Fatal("Could not connect to MongoDB:", err)
	}

	log.Println("Connected to MongoDB!")
	DB = client
	return client
}

func GetTodoCollection() *mongo.Collection {
	ConnectDB()
	if DB == nil {
		log.Fatal("DB connection is nil — did you forget to call ConnectDB()?")
	}
	return DB.Database("taskTide").Collection("todos")
}

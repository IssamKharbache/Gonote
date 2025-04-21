package config

import (
	"context"
	"log"
	"os"
	"sync"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	DB     *mongo.Client
	dbOnce sync.Once
)

func ConnectDB() *mongo.Client {
	dbOnce.Do(func() {
		err := godotenv.Load(".env")
		if err != nil {
			log.Println("Warning: Failed to load .env file (might be okay in production)")
		}

		mongoURI := os.Getenv("MONGODB_URI")
		if mongoURI == "" {
			log.Fatal("MONGODB_URI environment variable not set")
		}

		clientOptions := options.Client().ApplyURI(mongoURI)
		client, err := mongo.Connect(context.TODO(), clientOptions)
		if err != nil {
			log.Fatal("Failed to connect to MongoDB:", err)
		}

		err = client.Ping(context.TODO(), nil)
		if err != nil {
			log.Fatal("Could not ping MongoDB:", err)
		}

		DB = client
		log.Println("Connected to MongoDB!")

		// Create indexes after successful connection
		if err := createIndexes(); err != nil {
			log.Fatal("Failed to create indexes:", err)
		}
	})

	return DB
}

func GetTodoCollection() *mongo.Collection {
	return getCollection("todos")
}

func GetUserCollection() *mongo.Collection {
	return getCollection("users")
}

func getCollection(name string) *mongo.Collection {
	if DB == nil {
		ConnectDB()
	}
	return DB.Database("taskTide").Collection(name)
}

func createIndexes() error {
	userCollection := GetUserCollection()

	// 1. Check if index already exists
	cursor, err := userCollection.Indexes().List(context.TODO())
	if err != nil {
		return err
	}
	defer cursor.Close(context.TODO())

	var results []bson.M
	if err = cursor.All(context.TODO(), &results); err != nil {
		return err
	}

	emailIndexExists := false
	for _, result := range results {
		if key, ok := result["key"].(bson.M); ok {
			if _, exists := key["email"]; exists {
				emailIndexExists = true
				break
			}
		}
	}

	// 2. Only create if doesn't exist
	if !emailIndexExists {
		emailIndexModel := mongo.IndexModel{
			Keys:    bson.D{{Key: "email", Value: 1}},
			Options: options.Index().SetUnique(true),
		}
		_, err := userCollection.Indexes().CreateOne(context.TODO(), emailIndexModel)
		if err != nil {
			return err
		}
		log.Println("Created unique email index")
	} else {
		log.Println("Email index already exists - skipping creation")
	}

	return nil
}

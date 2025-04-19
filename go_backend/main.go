package main

import (
	"log"
	"os"

	"go_backend/config"
	"go_backend/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func main() {
	//connection to the data base
	config.ConnectDB()

	//initialize fiber
	app := fiber.New()
	//allowing cors
	app.Use(cors.New(cors.Config{
		AllowOrigins: os.Getenv("FRONT_END_URL"),
		AllowHeaders: "Origin, Content-Type, Accept",
	}))
	//initialize routes
	routes.TodoRoutes(app)
	//run the server
	port := os.Getenv("PORT")
	if port == "" {
		port = "4000"
	}

	log.Fatal(app.Listen("0.0.0.0:" + port))
}

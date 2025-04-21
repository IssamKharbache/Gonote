package main

import (
	"log"
	"os"

	"go_backend/config"
	"go_backend/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

func main() {
	// Initialize database connection
	config.ConnectDB()

	// Create Fiber app
	app := fiber.New()

	// Middleware
	app.Use(logger.New()) // For request logging

	app.Use(cors.New(cors.Config{
		AllowOrigins:     os.Getenv("FRONT_END_URL"),
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		AllowMethods:     "GET, POST, PUT, DELETE, OPTIONS, PATCH",
		AllowCredentials: true,
	}))

	// Initialize routes
	routes.TodoRoutes(app)
	routes.UserRoutes(app)

	// Health check endpoint
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.SendString("OK")
	})

	// Handle 404
	app.Use(func(c *fiber.Ctx) error {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"error": "Endpoint not found",
		})
	})

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "4000"
	}
	log.Printf("Server starting on port %s", port)
	log.Fatal(app.Listen("0.0.0.0:" + port))
}

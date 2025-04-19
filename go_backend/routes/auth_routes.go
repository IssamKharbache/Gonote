package routes

import (
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func AuthHandlers(route fiber.Router, db *gorm.DB) {
	route.Post("/register", func(c *fiber.Ctx) error {
		return c.SendString("registred")
	})
	route.Post("/login", func(c *fiber.Ctx) error {
		return c.SendString("logged in")
	})

}

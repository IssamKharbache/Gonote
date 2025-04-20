package routes

import (
	user "go_backend/controllers"

	"github.com/gofiber/fiber/v2"
)

func UserRoutes(app *fiber.App) {
	api := app.Group("/api/users")
	api.Get("/", user.Get_user)
	api.Post("/create", user.Create_user)
}

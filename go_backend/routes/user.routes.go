package routes

import (
	"go_backend/auth"
	user "go_backend/controllers"

	"github.com/gofiber/fiber/v2"
)

func UserRoutes(app *fiber.App) {
	api := app.Group("/api/users")

	api.Post("/create", user.Create_user)
	api.Post("/auth/login", user.Login)

	// Protected routes
	protected := api.Group("/", auth.Protected())
	//
	protected.Get("/get/:id", user.GetCurrentUser)
	protected.Post("/auth/logout", user.Logout)

}

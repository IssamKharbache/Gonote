package routes

import (
	"go_backend/controllers"

	"github.com/gofiber/fiber/v2"
)

func TodoRoutes(app *fiber.App) {
	api := app.Group("/api/todos")
	api.Get("/", controllers.GetTodos)
	api.Post("/create", controllers.CreateTodo)
	api.Patch("/update/:id", controllers.UpdateTodo)
	api.Patch("/updateContent/:id", controllers.UpdateTodoContent)
	api.Get("/:id", controllers.GetTodo)
	api.Delete("/delete/:id", controllers.DeleteTodo)
}

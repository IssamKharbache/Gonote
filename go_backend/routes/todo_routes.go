package routes

import (
	todo "go_backend/controllers"

	"github.com/gofiber/fiber/v2"
)

func TodoRoutes(app *fiber.App) {
	api := app.Group("/api/todos")
	api.Get("/", todo.GetTodos)
	api.Post("/create", todo.CreateTodo)
	api.Patch("/update/:id", todo.UpdateTodo)
	api.Patch("/updateContent/:id", todo.UpdateTodoContent)
	api.Get("/:id", todo.GetTodo)
	api.Delete("/delete/:id", todo.DeleteTodo)
}

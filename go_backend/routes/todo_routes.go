package routes

import (
	"go_backend/auth"
	todo "go_backend/controllers"

	"github.com/gofiber/fiber/v2"
)

func TodoRoutes(app *fiber.App) {
	api := app.Group("/api/todos")
	protected := api.Group("/", auth.Protected())

	protected.Get("/", todo.GetTodos)
	protected.Post("/create", todo.CreateTodo)
	protected.Patch("/update/:id", todo.UpdateTodo)
	protected.Patch("/updateContent/:id", todo.UpdateTodoContent)
	protected.Get("/user/:id", todo.GetUserTodos)
	protected.Delete("/delete/:id", todo.DeleteTodo)
	protected.Delete("/deleteOld", todo.DeleteTodaysCompletedTodos)
}

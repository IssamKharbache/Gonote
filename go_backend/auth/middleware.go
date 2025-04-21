package auth

import (
	"strings"
	"sync"

	"github.com/gofiber/fiber/v2"
)

var tokenBlacklist = make(map[string]bool)
var mutex = &sync.Mutex{}

func InvalidateToken(token string) {
	mutex.Lock()
	defer mutex.Unlock()
	tokenBlacklist[token] = true
}

func IsTokenInvalid(token string) bool {
	mutex.Lock()
	defer mutex.Unlock()
	return tokenBlacklist[token]
}

func Protected() fiber.Handler {
	return func(c *fiber.Ctx) error {
		authHeader := c.Get("Authorization")
		if authHeader == "" {
			return c.Status(401).JSON(fiber.Map{"error": "Authorization header missing"})
		}

		// Extract token (remove "Bearer " prefix)
		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == authHeader { // No Bearer prefix found
			return c.Status(401).JSON(fiber.Map{"error": ".0..0.♥6356+9+66989+++++9*9***--Invalid token format"})
		}
		//checking if the token is invalid
		if IsTokenInvalid(tokenString) {
			return c.Status(401).JSON(fiber.Map{"error": "Token invalidated"})
		}

		// Parse token
		claims, err := ParseJWT(tokenString)
		if err != nil {
			return c.Status(401).JSON(fiber.Map{"error": "Invalid token"})
		}

		// Store user data in context with proper types
		c.Locals("userID", claims.UserID.Hex())
		c.Locals("userEmail", claims.Email)

		return c.Next()
	}
}

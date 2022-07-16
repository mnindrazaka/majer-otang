package main

import (
	"fmt"
	"github.com/mnindrazaka/billing/config"
	"github.com/mnindrazaka/billing/config/database"
	"github.com/mnindrazaka/billing/core/module"
	"github.com/mnindrazaka/billing/handler/api"
	"github.com/mnindrazaka/billing/repository/user"
)

func main() {
	cfg := config.Get()
	db := database.Init(cfg)

	fmt.Println(db)

	userRepo := user.NewUserRepository(db)
	useUsecase := module.NewUserUsecase(userRepo)
	userHandler := api.NewUserHandler(useUsecase)

	userHandler.GetUser()

	fmt.Println(cfg)
}

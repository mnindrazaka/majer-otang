package main

import (
	"fmt"
	"github.com/joho/godotenv"
	"github.com/julienschmidt/httprouter"
	"github.com/mnindrazaka/billing/config"
	"github.com/mnindrazaka/billing/config/database"
	"github.com/mnindrazaka/billing/core/module"
	"github.com/mnindrazaka/billing/handler/api"
	"github.com/mnindrazaka/billing/repository/members"
	"log"
	"net/http"
)

func main() {
	// load environemnt
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// get config
	cfg := config.Get()

	// ini database connection
	db, err := database.Init(cfg)
	if err != nil {
		log.Fatalf("Error init database connection = %v", err)
	}

	// example impelementation
	memberRepo := members.NewMemberRepository(db)
	memberUsecase := module.NewMemberUsecase(memberRepo)
	memberHalder := api.NewUserHandler(memberUsecase)

	router := httprouter.New()
	router.GET("/member/:memberID", memberHalder.GetMemberByID)

	err = http.ListenAndServe(fmt.Sprintf(":%v", cfg.Port), router)
	if err != nil {
		log.Fatalf("error serve server = %v", err)
	}
}

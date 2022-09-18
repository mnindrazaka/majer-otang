package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/go-playground/validator/v10"

	"github.com/joho/godotenv"
	"github.com/julienschmidt/httprouter"
	"github.com/mnindrazaka/billing/config"
	"github.com/mnindrazaka/billing/config/database"
	"github.com/mnindrazaka/billing/core/module"
	"github.com/mnindrazaka/billing/handler/api"
	"github.com/mnindrazaka/billing/repository/billingMembers"
	"github.com/mnindrazaka/billing/repository/billings"
	"github.com/mnindrazaka/billing/repository/members"
)

func main() {
	// load environment
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

	// example implementation
	memberRepo := members.NewMemberRepository(db)
	memberUsecase := module.NewMemberUsecase(memberRepo)
	memberHandler := api.NewUserHandler(memberUsecase)

	validate := validator.New()
	billingRepo := billings.NewBillingRepository(db)
	billingMemberRepo := billingMembers.NewBillingMemberRepository(db)
	billingUsecase := module.NewBillingUsecase(billingRepo, billingMemberRepo, validate)
	billingHandler := api.NewBillingHandler(billingUsecase)

	paymentUsecase := module.NewPaymentUsecase(billingMemberRepo, billingRepo)
	paymentHandler := api.NewPaymentHandler(paymentUsecase)

	router := httprouter.New()
	router.GET("/members/:memberID", memberHandler.GetMemberByID)
	router.GET("/members", memberHandler.GetMemberList)

	// billings
	router.GET("/billings/:billingID", billingHandler.GetBillingByID)
	router.POST("/billings", billingHandler.CreateBilling)
	router.GET("/billings", billingHandler.GetBillings)
	router.PUT("/billings/:billingID", billingHandler.UpdateBilling)

	// payment
	router.PUT("/payments", paymentHandler.UpdatePayment)
	router.GET("/payments", paymentHandler.GetPaymentByMemberID)

	err = http.ListenAndServe(fmt.Sprintf(":%v", cfg.Port), router)
	if err != nil {
		log.Fatalf("error serve server = %v", err)
	}
}

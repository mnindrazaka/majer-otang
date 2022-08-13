package api

import (
	"github.com/julienschmidt/httprouter"
	"github.com/mnindrazaka/billing/core/module"
	"net/http"
)

type billingHandler struct {
	billingUsecase module.BillingUsecase
}

type BillingHandler interface {
	GetBillings(w http.ResponseWriter, r *http.Request, ps httprouter.Params)
}

func NewBillingHandler(billingUsecase module.BillingUsecase) BillingHandler {
	return &billingHandler{billingUsecase}
}

func (b *billingHandler) GetBillings(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	billings, err := b.billingUsecase.GetBillingsList(r.Context())
	if err != nil {
		buildGetBililngsError(w, err)
		return
	}

	buildSuccessResponse(w, billings)
}

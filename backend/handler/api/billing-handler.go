package api

import (
	"net/http"

	"github.com/julienschmidt/httprouter"
	"github.com/mnindrazaka/billing/core/module"
)

type billingHandler struct {
	billingUsecase module.BillingUsecase
}

type BillingHandler interface{
	GetBillingByID(w http.ResponseWriter, r *http.Request, ps httprouter.Params)
}

func NewBillingHandler(billingUsecase module.BillingUsecase) BillingHandler {
	return &billingHandler{billingUsecase}
}

func (b *billingHandler) GetBillingByID(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	billing, err := b.billingUsecase.GetBillingByID(r.Context(), ps.ByName("billingID"))
	if err != nil {
		buildGetBillingByIDError(w, err)
		return
	}
	buildGetBillingByIDSuccess(w, billing)
}
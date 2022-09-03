package api

import (
	"github.com/julienschmidt/httprouter"
	"github.com/mnindrazaka/billing/core/entity"
	"github.com/mnindrazaka/billing/core/module"
	"net/http"
)

type paymentHandler struct {
	paymentUsecase module.PaymentUsecase
}

type PaymentHandler interface {
	UpdatePayment(w http.ResponseWriter, r *http.Request, ps httprouter.Params)
}

func NewPaymentHandler(paymentUsecase module.PaymentUsecase) PaymentHandler {
	return &paymentHandler{paymentUsecase}
}

func (p *paymentHandler) UpdatePayment(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	var paymentRequest entity.PaymentRequest

	ReadFromRequestBody(w, r, &paymentRequest)

	err := p.paymentUsecase.UpdatePayment(r.Context(), &paymentRequest)
	if err != nil {
		buildUpdatePaymentError(w, err)
	}

	buildSuccessResponse(w, nil)
}

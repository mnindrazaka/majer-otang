package api

import (
	"github.com/mnindrazaka/billing/core/entity"
	"net/http"
)

func buildGetBililngsError(w http.ResponseWriter, err error) {
	switch err {
	default:
		buildInternalServerResponse(w, err)
	}
}

func builGetBillingsSuccessResponse(w http.ResponseWriter, data []entity.Billing) {
	buildSuccessResponse2(w, entity.NewGetBillingListResponse(data, "success", "success"))
}

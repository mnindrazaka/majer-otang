package api

import (
	"net/http"

	"github.com/mnindrazaka/billing/utils"
)

func buildGetBillingByIDError(w http.ResponseWriter, err error) {
	switch err {
	case utils.ErrNoDocument, utils.ErrorInvalidPrimitiveID:
		buildBadRequestResponse(w, err)
	default:
		buildInternalServerResponse(w, err)
	}
}

func buildGetBililngsError(w http.ResponseWriter, err error) {
	switch err {
	default:
		buildInternalServerResponse(w, err)
	}
}

func buildGetBillingByIDSuccess(w http.ResponseWriter, data interface{}) {
	buildSuccessResponse(w, data)
}

package api

import (
	"github.com/mnindrazaka/billing/utils"
	"net/http"
)

func buildUpdatePaymentError(w http.ResponseWriter, err error) {
	switch err {
	default:
		buildInternalServerResponse(w, err)
	}
}

func buildGetPaymentByMemberIDError(w http.ResponseWriter, err error) {
	switch err {
	case utils.ErrNoDocument, utils.ErrorInvalidPrimitiveID:
		buildBadRequestResponse(w, err)
	default:
		buildInternalServerResponse(w, err)
	}
}

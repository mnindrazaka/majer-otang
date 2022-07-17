package api

import (
	"github.com/mnindrazaka/billing/utils"
	"net/http"
)

func buildGetMemberByIDError(w http.ResponseWriter, err error) {
	switch err {
	case utils.ErrNoDocument, utils.ErrorInvalidPrimitiveID:
		buildBadRequestResponse(w, err)
	default:
		buildInternalServerResponse(w, err)
	}
}

func buildGetMemberByIDSuccess(w http.ResponseWriter, data interface{}) {
	buildSuccessResponse(w, data)
}

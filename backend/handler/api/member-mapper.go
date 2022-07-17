package api

import (
	"github.com/mnindrazaka/billing/core/entity"
	"net/http"
)

func buildGetMemberByIDError(w http.ResponseWriter, err error) {
	switch err {
	case entity.ErrorNoDocument, entity.ErrorInvalidPrimitiveID:
		buildBadRequestResponse(w, err)
	default:
		buildInternalServerResponse(w, err)
	}
}

func buildGetMemberByIDSuccess(w http.ResponseWriter, data interface{}) {
	buildSuccessResponse(w, data)
}

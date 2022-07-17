package api

import (
	"net/http"

	"github.com/mnindrazaka/billing/utils"
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

func buildGetMemberListError(w http.ResponseWriter, err error) {
	switch err {
	case utils.ErrNoDocument, utils.ErrorInvalidPrimitiveID:
		buildBadRequestResponse(w, err)
	default:
		buildInternalServerResponse(w, err)
	}
}

func buildGetMemberListSuccess(w http.ResponseWriter, data interface{}) {
	buildSuccessResponse(w, data)
}

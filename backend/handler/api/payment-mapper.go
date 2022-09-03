package api

import "net/http"

func buildUpdatePaymentError(w http.ResponseWriter, err error) {
	switch err {
	default:
		buildInternalServerResponse(w, err)
	}
}

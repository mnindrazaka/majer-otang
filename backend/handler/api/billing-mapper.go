package api

import (
	"net/http"
)

func buildGetBililngsError(w http.ResponseWriter, err error) {
	switch err {
	default:
		buildInternalServerResponse(w, err)
	}
}

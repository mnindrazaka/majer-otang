package api

import (
	"encoding/json"
	"net/http"
)

func ReadFromRequestBody(w http.ResponseWriter, request *http.Request, result interface{}) {
	decoder := json.NewDecoder(request.Body)

	err := decoder.Decode(result)
	if err != nil {
		buildBadRequestResponse(w, err)
	}
}

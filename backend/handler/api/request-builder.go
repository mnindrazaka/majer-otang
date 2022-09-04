package api

import (
	"encoding/json"
	"fmt"
	"net/http"
)

func ReadFromRequestBody(w http.ResponseWriter, request *http.Request, result interface{}) {
	decoder := json.NewDecoder(request.Body)
	fmt.Println("req body: ", request.Body)

	err := decoder.Decode(result)
	if err != nil {
		buildBadRequestResponse(w, err)
	}
}

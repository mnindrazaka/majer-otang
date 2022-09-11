package api

import (
	"encoding/json"
	"net/http"
)

type response struct {
	Data    interface{} `json:"data"`
	Status  string      `json:"status"`
	Message string      `json:"message"`
}

func buildResponse(data interface{}, status string, err error) response {
	var res response
	res.Data = data
	res.Status = status
	if err != nil {
		res.Message = err.Error()
	}

	return res
}

func buildCreateResponse(status string, err error) response {
	var res response

	res.Status = status
	if err != nil {
		res.Message = err.Error()
	}

	return res
}

func buildSuccessResponse(w http.ResponseWriter, result interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "*")
	w.Header().Set("Access-Control-Allow-Headers", "*")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(buildResponse(result, http.StatusText(http.StatusOK), nil))
}

func buildBadRequestResponse(w http.ResponseWriter, err error) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "*")
	w.Header().Set("Access-Control-Allow-Headers", "*")
	w.WriteHeader(http.StatusBadRequest)
	json.NewEncoder(w).Encode(buildResponse(nil, http.StatusText(http.StatusBadRequest), err))
}

func buildInternalServerResponse(w http.ResponseWriter, err error) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "*")
	w.Header().Set("Access-Control-Allow-Headers", "*")
	w.WriteHeader(http.StatusInternalServerError)
	json.NewEncoder(w).Encode(buildResponse(nil, http.StatusText(http.StatusInternalServerError), err))
}

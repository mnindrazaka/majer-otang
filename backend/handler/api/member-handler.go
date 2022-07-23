package api

import (
	"net/http"

	"github.com/julienschmidt/httprouter"
	"github.com/mnindrazaka/billing/core/module"
)

type memberHandler struct {
	userUsecase module.MemberUsecase
}

type UserHandler interface {
	GetMemberByID(w http.ResponseWriter, r *http.Request, ps httprouter.Params)
	GetMemberList(w http.ResponseWriter, r *http.Request, ps httprouter.Params)
}

func NewUserHandler(userUsecase module.MemberUsecase) UserHandler {
	return &memberHandler{userUsecase}
}

func (m *memberHandler) GetMemberByID(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	member, err := m.userUsecase.GetMemberByID(r.Context(), ps.ByName("memberID"))
	if err != nil {
		buildGetMemberByIDError(w, err)
		return
	}

	buildSuccessResponse(w, member)
}

func (m *memberHandler) GetMemberList(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	memberResponse, err := m.userUsecase.GetMemberList(r.Context())

	if err != nil {
		buildGetMemberListError(w, err)
		return
	}

	buildSuccessResponse(w, memberResponse)
}

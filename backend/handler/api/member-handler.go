package api

import (
	"github.com/julienschmidt/httprouter"
	"github.com/mnindrazaka/billing/core/module"
	"net/http"
)

type memberHandler struct {
	userUsecase module.MemberUsecase
}

type UserHandler interface {
	GetMemberByID(w http.ResponseWriter, r *http.Request, ps httprouter.Params)
}

func NewUserHandler(userUsecase module.MemberUsecase) UserHandler {
	return &memberHandler{userUsecase}
}

func (m *memberHandler) GetMemberByID(w http.ResponseWriter, r *http.Request, ps httprouter.Params) {
	member, err := m.userUsecase.GetMemberByID(ps.ByName("memberID"))
	if err != nil {
		buildGetMemberByIDError(w, err)
		return
	}

	buildSuccessResponse(w, member)
}

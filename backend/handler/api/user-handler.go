package api

import (
	"github.com/mnindrazaka/billing/core/entity"
	"github.com/mnindrazaka/billing/core/module"
)

type userHandler struct {
	userUsecase module.UserUsercase
}

type UserHandler interface {
	GetUser() (*entity.User, error)
}

func NewUserHandler(userUsecase module.UserUsercase) UserHandler {
	return &userHandler{userUsecase}
}

func (u *userHandler) GetUser() (*entity.User, error) {
	return u.userUsecase.GetUser()
}

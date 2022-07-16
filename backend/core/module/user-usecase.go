package module

import (
	"github.com/mnindrazaka/billing/core/entity"
	"github.com/mnindrazaka/billing/core/repository"
)

type userUsecase struct {
	userRepository repository.UserRepository
}

type UserUsercase interface {
	GetUser() (*entity.User, error)
}

func NewUserUsecase(userRepository repository.UserRepository) UserUsercase {
	return &userUsecase{userRepository}
}

func (u *userUsecase) GetUser() (*entity.User, error) {
	return u.userRepository.GetUser()
}

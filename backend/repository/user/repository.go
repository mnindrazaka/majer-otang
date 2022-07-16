package user

import (
	"github.com/mnindrazaka/billing/core/entity"
	"github.com/mnindrazaka/billing/core/repository"
)

type userRepository struct {
	db error
}

func NewUserRepository(cfg error) repository.UserRepository {
	return &userRepository{cfg}
}

func (u userRepository) GetUser() (*entity.User, error) {
	return &entity.User{}, nil
}

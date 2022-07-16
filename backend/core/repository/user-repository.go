package repository

import "github.com/mnindrazaka/billing/core/entity"

type UserRepository interface {
	GetUser() (*entity.User, error)
}

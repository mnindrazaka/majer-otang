package repository

import "github.com/mnindrazaka/billing/core/entity"

type MemberRepository interface {
	GetMemberByID(id string) (*entity.Member, error)
}

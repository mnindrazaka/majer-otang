package repository

import (
	"context"
	"github.com/mnindrazaka/billing/core/entity"
)

type MemberRepository interface {
	GetMemberByID(ctx context.Context, id string) (*entity.Member, error)
}

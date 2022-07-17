package module

import (
	"context"
	"github.com/mnindrazaka/billing/core/entity"
	"github.com/mnindrazaka/billing/core/repository"
)

type memberUsecase struct {
	memberRepository repository.MemberRepository
}

type MemberUsecase interface {
	GetMemberByID(ctx context.Context, id string) (*entity.Member, error)
}

func NewMemberUsecase(userRepository repository.MemberRepository) MemberUsecase {
	return &memberUsecase{userRepository}
}

func (m *memberUsecase) GetMemberByID(ctx context.Context, id string) (*entity.Member, error) {
	return m.memberRepository.GetMemberByID(ctx, id)
}

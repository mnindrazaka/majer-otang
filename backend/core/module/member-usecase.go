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
	GetMemberList(ctx context.Context) ([]entity.Member, error)
}

func NewMemberUsecase(memberRepository repository.MemberRepository) MemberUsecase {
	return &memberUsecase{memberRepository}
}

func (m *memberUsecase) GetMemberByID(ctx context.Context, id string) (*entity.Member, error) {
	return m.memberRepository.GetMemberByID(ctx, id)
}

func (m *memberUsecase) GetMemberList(ctx context.Context) ([]entity.Member, error) {
	return m.memberRepository.GetMemberList(ctx)
}


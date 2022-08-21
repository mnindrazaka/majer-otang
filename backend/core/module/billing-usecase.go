package module

import (
	"context"
	"github.com/go-playground/validator/v10"

	"github.com/mnindrazaka/billing/core/entity"
	"github.com/mnindrazaka/billing/core/repository"
)

type billingUsecase struct {
	billingRepository       repository.BillingRepository
	billingMemberRepository repository.BillingMemberRepository
	validate                *validator.Validate
}

type BillingUsecase interface {
	GetBillingsList(ctx context.Context) ([]*entity.Billing, error)
	GetBillingByID(ctx context.Context, id string) (*entity.BillingDetail, error)
	CreateBilling(ctx context.Context, billingDetail entity.BillingDetail) (*entity.BillingDetail, error)
}

func NewBillingUsecase(billingRepository repository.BillingRepository, billingMemberRepository repository.BillingMemberRepository, validate *validator.Validate) BillingUsecase {
	return &billingUsecase{billingRepository, billingMemberRepository, validate}
}

func (b *billingUsecase) GetBillingByID(ctx context.Context, id string) (*entity.BillingDetail, error) {
	billing, err := b.billingRepository.GetBillingByID(ctx, id)
	billingMembers, err := b.billingMemberRepository.GetBillingMemberByBillingID(ctx, id)

	billing.SetMembers(billingMembers)

	return billing, err
}

func (b *billingUsecase) GetBillingsList(ctx context.Context) ([]*entity.Billing, error) {
	return b.billingRepository.GetBillingList(ctx)
}

func (b *billingUsecase) CreateBilling(ctx context.Context, request entity.BillingDetail) (*entity.BillingDetail, error) {
	err := b.validate.Struct(request)

	billing := entity.BillingDetail{
		Title:           request.Title,
		BillAmount:      request.BillAmount,
		ChargedMemberId: request.ChargedMemberId,
		IsBillEqually:   request.IsBillEqually,
		Members:         request.Members,
	}
	return &billing, err
}

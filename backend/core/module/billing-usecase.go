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
	billing := entity.BillingDetail{
		Title:         request.Title,
		BillAmount:    request.BillAmount,
		MemberId:      request.MemberId,
		IsBillEqually: request.IsBillEqually,
	}

	billingDetail, err := b.billingRepository.CreateBilling(ctx, billing)

	// loop members
	var amount int
	if request.IsBillEqually {
		amount = int(request.BillAmount) / len(request.Members)
	}

	for _, member := range request.Members {
		billingMember := repository.BillingMemberData{
			MemberId:        member.Id,
			BillingId:       billingDetail.Id,
			Status:          "unpaid",
			ChargedMemberId: billingDetail.MemberId,
		}

		if request.IsBillEqually && amount != 0 {
			billingMember.Amount = int32(amount)
		} else {
			billingMember.Amount = member.Amount
		}

		err := b.billingMemberRepository.CreateBillingMember(ctx, billingMember)
		if err != nil {
			return nil, err
		}
	}

	return nil, err
}

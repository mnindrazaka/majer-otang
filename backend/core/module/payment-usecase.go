package module

import (
	"context"
	"github.com/mnindrazaka/billing/core/entity"
	"github.com/mnindrazaka/billing/core/repository"
)

type paymentUsecase struct {
	billingMemberRepo repository.BillingMemberRepository
	billingRepo       repository.BillingRepository
}

type PaymentUsecase interface {
	UpdatePayment(ctx context.Context, paymentRequest *entity.PaymentRequest) error
	GetPaymentByMemberID(ctx context.Context, memberID string) ([]*entity.Payment, error)
}

func NewPaymentUsecase(billingMemberRepo repository.BillingMemberRepository, billingRepo repository.BillingRepository) PaymentUsecase {
	return &paymentUsecase{billingMemberRepo, billingRepo}
}

func (p *paymentUsecase) UpdatePayment(ctx context.Context, paymentRequest *entity.PaymentRequest) error {
	// update target member id
	err := p.billingMemberRepo.UpdateBillingMemberByBillingID(ctx, paymentRequest.TargetMemberId)
	if err != nil {
		return err
	}

	// update charged member id
	err = p.billingMemberRepo.UpdateBillingMemberByBillingID(ctx, paymentRequest.ChargedMemberId)
	if err != nil {
		return err
	}

	return nil
}

func (p *paymentUsecase) GetPaymentByMemberID(ctx context.Context, memberID string) ([]*entity.Payment, error) {
	bilings, err := p.billingRepo.GetBillingByMemberID(ctx, memberID)
	if err != nil {
		return nil, err
	}

	return buildPaymentData(bilings), nil
}

func buildPaymentData(bilings []*entity.BillingDetail) []*entity.Payment {
	var payments []*entity.Payment
	for _, biling := range bilings {
		payments = append(payments, &entity.Payment{
			Name:     biling.Title,
			Amount:   biling.BillAmount,
			MemberId: biling.MemberId,
		})
	}

	return payments
}

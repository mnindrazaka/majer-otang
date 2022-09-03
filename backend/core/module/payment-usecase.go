package module

import (
	"context"
	"github.com/mnindrazaka/billing/core/entity"
	"github.com/mnindrazaka/billing/core/repository"
)

type paymentUsecase struct {
	billingMemberRepo repository.BillingMemberRepository
}

type PaymentUsecase interface {
	UpdatePayment(ctx context.Context, paymentRequest *entity.PaymentRequest) error
}

func NewPaymentUsecase(billingMemberRepo repository.BillingMemberRepository) PaymentUsecase {
	return &paymentUsecase{billingMemberRepo}
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

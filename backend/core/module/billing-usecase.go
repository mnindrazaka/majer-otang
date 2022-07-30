package module

import (
	"context"

	"github.com/mnindrazaka/billing/core/entity"
	"github.com/mnindrazaka/billing/core/repository"
)

type billingUsecase struct {
	billingRepository repository.BillingRepository
}

type BillingUsecase interface {
	GetBillingByID(ctx context.Context, id string) (*entity.Billing, error)
}

func NewBillingUsecase(billingRepository repository.BillingRepository) BillingUsecase {
	return &billingUsecase{billingRepository}
}

func (b *billingUsecase) GetBillingByID(ctx context.Context, id string) (*entity.Billing, error) {
	return b.billingRepository.GetBillingByID(ctx, id)
}
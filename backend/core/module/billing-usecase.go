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
	GetBillingsList(ctx context.Context) ([]*entity.Billing, error)
}

func NewBillingUsecase(billingRepository repository.BillingRepository) BillingUsecase {
	return &billingUsecase{billingRepository}
}

func (b *billingUsecase) GetBillingsList(ctx context.Context) ([]*entity.Billing, error) {
	return b.billingRepository.GetBillingList(ctx)
}

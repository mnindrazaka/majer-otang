package repository

import (
	"context"
	"github.com/mnindrazaka/billing/core/entity"
)

type BillingRepository interface {
	GetBillingList(ctx context.Context) ([]*entity.Billing, error)
}

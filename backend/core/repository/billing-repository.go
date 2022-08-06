package repository

import (
	"context"

	"github.com/mnindrazaka/billing/core/entity"
)

type BillingRepository interface {
	GetBillingByID(ctx context.Context, id string) (*entity.BillingDetail, error)
}
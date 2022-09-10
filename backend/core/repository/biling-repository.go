package repository

import (
	"context"

	"github.com/mnindrazaka/billing/core/entity"
)

type BillingRepository interface {
	GetBillingList(ctx context.Context) ([]*entity.Billing, error)
	GetBillingByID(ctx context.Context, id string) (*entity.BillingDetail, error)
	CreateBilling(ctx context.Context, billingDetail entity.BillingDetail) (*entity.BillingDetail, error)
	GetBillingByMemberID(ctx context.Context, memberID string) ([]*entity.BillingDetail, error)
}

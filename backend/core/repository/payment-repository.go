package repository

import (
	"context"
	"github.com/mnindrazaka/billing/core/entity"
)

type PaymentRepository interface {
	GetPaymentByMemberID(ctx context.Context, memberID string) *entity.BillingDetail
}

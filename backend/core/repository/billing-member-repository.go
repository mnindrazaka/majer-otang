package repository

import (
	"context"

	"github.com/mnindrazaka/billing/core/entity"
)

type BillingMemberRepository interface {
	GetBillingMemberByBillingID(ctx context.Context, id string) ([]entity.BillingMember, error)
}

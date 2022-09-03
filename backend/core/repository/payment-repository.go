package repository

import "context"

type PaymenRepository interface {
	UpdatePayment(ctx context.Context, billingId string) error
}

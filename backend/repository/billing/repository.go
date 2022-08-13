package billing

import (
	"context"
	"github.com/mnindrazaka/billing/core/entity"
	"github.com/mnindrazaka/billing/core/repository"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type billingRepository struct {
	db *mongo.Client
}

func NewBillingRepository(db *mongo.Client) repository.BillingRepository {
	return &billingRepository{db}
}

func (b *billingRepository) GetBillingList(ctx context.Context) ([]entity.Billing, error) {
	cursor, err := b.db.Database("billing").
		Collection("billings").
		Find(ctx, bson.M{})

	if err != nil {
		return nil, err
	}

	var billings []entity.Billing
	for cursor.Next(ctx) {
		var billing entity.Billing
		cursor.Decode(&billing)
		billings = append(billings, billing)
	}

	return billings, nil
}

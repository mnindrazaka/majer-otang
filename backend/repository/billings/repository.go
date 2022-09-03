package billings

import (
	"context"
	"github.com/mnindrazaka/billing/core/entity"
	"github.com/mnindrazaka/billing/core/repository"
	"github.com/mnindrazaka/billing/utils"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type billingRepository struct {
	db *mongo.Client
}

func NewBillingRepository(db *mongo.Client) repository.BillingRepository {
	return &billingRepository{db}
}

func (b *billingRepository) GetBillingList(ctx context.Context) ([]*entity.Billing, error) {
	cursor, err := b.db.Database("billing").
		Collection("billings").
		Find(ctx, bson.M{})

	if err != nil {
		return nil, err
	}

	var billings []*entity.Billing
	for cursor.Next(ctx) {
		var billing entity.Billing
		cursor.Decode(&billing)
		billings = append(billings, &billing)
	}

	return billings, nil
}

func (b *billingRepository) GetBillingByID(ctx context.Context, id string) (*entity.BillingDetail, error) {
	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, utils.ErrorInvalidPrimitiveID
	}

	var billing *entity.BillingDetail
	err = b.db.Database("billing").Collection("billings").FindOne(context.TODO(), bson.M{"_id": objectId}).Decode(&billing)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, utils.ErrNoDocument
		}
		return nil, err
	}

	return billing, nil
}

func (b *billingRepository) CreateBilling(ctx context.Context, billingDetail entity.BillingDetail) (*entity.BillingDetail, error) {
	data := bson.D{
		{"title", billingDetail.Title},
		{"billAmount", billingDetail.BillAmount},
		{"chargedMemberId", billingDetail.ChargedMemberId},
		{"isBillEqually", billingDetail.IsBillEqually},
		{"member", billingDetail.Members}}

	result, err := b.db.Database("billing").Collection("billings").InsertOne(context.TODO(), data)
	if err != nil {
		return nil, err
	}
	// get id from inserted row
	billingDetail.Id = result.InsertedID.(primitive.ObjectID).Hex()
	//dataMember := bson.A{billingDetail.Members}
	//a := append(dataMember, bson.E{Key: "billing_id", Value: result.InsertedID.(primitive.ObjectID).Hex()})
	//_, err = b.db.Database("billing").Collection("billing_members").InsertOne(context.TODO(), a)

	//if err != nil {
	//	return nil, err
	//}

	return &billingDetail, nil
}

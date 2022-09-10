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
	chargedMemberIdConvert, err := primitive.ObjectIDFromHex(billingDetail.MemberId)
	if err != nil {
		return nil, utils.ErrorInvalidPrimitiveID
	}

	data := bson.D{
		{"title", billingDetail.Title},
		{"bill_amount", billingDetail.BillAmount},
		{"member_id", chargedMemberIdConvert},
		{"is_bill_equal", billingDetail.IsBillEqually}}

	result, err := b.db.Database("billing").Collection("billings").InsertOne(context.TODO(), data)
	if err != nil {
		return nil, err
	}
	// get id from inserted row
	billingDetail.Id = result.InsertedID.(primitive.ObjectID).Hex()

	return &billingDetail, nil
}

func (b *billingRepository) UpdateBilling(ctx context.Context, billingId string, billingDetail entity.BillingDetail) (*entity.BillingDetail, error) {
	billing := b.db.Database("billing").Collection("billings")

	id, err := primitive.ObjectIDFromHex(billingId)
	if err != nil {
		return nil, utils.ErrorInvalidPrimitiveID
	}
	chargedMemberIdConvert, err := primitive.ObjectIDFromHex(billingDetail.ChargedMemberId)
	if err != nil {
		return nil, utils.ErrorInvalidPrimitiveID
	}

	filter := bson.D{{"_id", id}}
	dataUpdate := bson.D{{"$set", bson.D{
		{"title", billingDetail.Title},
		{"billAmount", billingDetail.BillAmount},
		{"chargedMemberId", chargedMemberIdConvert},
		{"isBillEqually", billingDetail.IsBillEqually},
	}}}

	_, err = billing.UpdateOne(context.TODO(), filter, dataUpdate)
	if err != nil {
		return nil, err
	}

	return &billingDetail, nil
}
func (b *billingRepository) GetBillingByMemberID(ctx context.Context, memberID string) ([]*entity.BillingDetail, error) {
	var billings []*entity.BillingDetail

	memberObjectID, err := primitive.ObjectIDFromHex(memberID)
	if err != nil {
		return nil, utils.ErrorInvalidPrimitiveID
	}

	cursor, err := b.db.Database("billing").Collection("billings").Find(ctx, bson.D{{"member_id", memberObjectID}})
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, utils.ErrNoDocument
		}
		return nil, err
	}

	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		// To decode into a struct, use cursor.Decode()
		result := &entity.BillingDetail{}
		err := cursor.Decode(&result)
		if err != nil {
			if err == mongo.ErrNoDocuments {
				return nil, utils.ErrNoDocument
			}
			return nil, err
		}

		billings = append(billings, result)
	}

	return billings, nil
}

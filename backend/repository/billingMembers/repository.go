package billingMembers

import (
	"context"

	"github.com/mnindrazaka/billing/core/entity"
	"github.com/mnindrazaka/billing/core/repository"
	"github.com/mnindrazaka/billing/utils"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type billingMemberRepository struct {
	db *mongo.Client
}

func NewBillingMemberRepository(cfg *mongo.Client) repository.BillingMemberRepository {
	return &billingMemberRepository{cfg}
}

func (bm *billingMemberRepository) GetBillingMemberByBillingID(ctx context.Context, id string) ([]entity.BillingMember, error) {
	objectId, err := primitive.ObjectIDFromHex(id)

	if err != nil {
		return nil, utils.ErrorInvalidPrimitiveID
	}

	var billingMembers []entity.BillingMember
	curr, _ := bm.db.Database("billing").Collection("billing_members").Find(context.TODO(), bson.M{"billing_id": objectId})

	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, utils.ErrNoDocument
		}
		return nil, err
	}

	if err = curr.All(context.TODO(), &billingMembers); err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, utils.ErrNoDocument
		}
		return nil, err
	}

	if err := curr.Err(); err != nil {
		return nil, err
	}

	return billingMembers, nil
}

func (bm *billingMemberRepository) CreateBillingMember(ctx context.Context, billingMemberData repository.BillingMemberData) error {
	billingIdConvert, _ := primitive.ObjectIDFromHex(billingMemberData.BillingId)
	chargedMemberIdConvert, _ := primitive.ObjectIDFromHex(billingMemberData.ChargedMemberId)
	memberIdConvert, _ := primitive.ObjectIDFromHex(billingMemberData.MemberId)
	data := bson.D{
		{"billing_id", billingIdConvert},
		{"charged_member_id", chargedMemberIdConvert},
		{"member_id", memberIdConvert},
		{"amount", billingMemberData.Amount},
		{"status", billingMemberData.Status},
	}

	_, err := bm.db.Database("billing").Collection("billing_members").InsertOne(context.TODO(), data)

	return err
}

func (bm *billingMemberRepository) DeleteBillingMember(ctx context.Context, billingId string) error {
	billingMember := bm.db.Database("billing").Collection("billing_members")

	billingIdConvert, _ := primitive.ObjectIDFromHex(billingId)

	_, err := billingMember.DeleteMany(context.TODO(), bson.M{"billing_id": billingIdConvert})
	if err != nil {
		return err
	}
	return err
}
func (bm *billingMemberRepository) UpdateBillingMemberByBillingID(ctx context.Context, chargedMemberID, targetMemberID string) error {
	chargedMemberIDObjectID, _ := primitive.ObjectIDFromHex(chargedMemberID)
	targetMemberIDObjectID, _ := primitive.ObjectIDFromHex(targetMemberID)

	filter := bson.D{{"member_id", targetMemberIDObjectID}, {"charged_member_id", chargedMemberIDObjectID}}

	update := bson.D{{"$set", bson.D{{"status", "paid"}}}}

	_, err := bm.db.Database("billing").Collection("billing_members").UpdateMany(ctx, filter, update)

	return err
}

func (bm *billingMemberRepository) GetBillingMemberByChargedMemberID(ctx context.Context, chargedeMemberID string, excludeMemberID bool) ([]*entity.BillingMemberDB, error) {
	memberObjectID, err := primitive.ObjectIDFromHex(chargedeMemberID)
	if err != nil {
		return nil, utils.ErrorInvalidPrimitiveID
	}

	var elements bson.M
	if excludeMemberID {
		elements = bson.M{
			"member_id": memberObjectID,
			"status":    "unpaid",
		}
	} else {
		elements = bson.M{
			"charged_member_id": memberObjectID,
			"status":            "unpaid",
		}
	}

	cursor, err := bm.db.Database("billing").Collection("billing_members").Find(ctx, elements)
	defer cursor.Close(context.Background())

	var billingMembers = []*entity.BillingMemberDB{}
	for cursor.Next(context.Background()) {

		result := &entity.BillingMemberDB{}
		err := cursor.Decode(&result)
		if err != nil {
			if err == mongo.ErrNoDocuments {
				return nil, utils.ErrNoDocument
			}
			return nil, err
		}

		billingMembers = append(billingMembers, result)
	}

	return billingMembers, nil
}

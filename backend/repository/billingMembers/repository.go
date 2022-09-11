package billingMembers

import (
	"context"
	"fmt"

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

	// get all members by billing_id
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

	fmt.Println("memberId conv: ", memberIdConvert)
	return err
}

func (bm *billingMemberRepository) DeleteBillingMember(ctx context.Context, billingId string) error {
	billingMember := bm.db.Database("billing").Collection("billing_members")
	// perlu filter by billing_id
	billingIdConvert, _ := primitive.ObjectIDFromHex(billingId)
	fmt.Println("billing ID convert: ", billingIdConvert)

	_, err := billingMember.DeleteMany(context.TODO(), bson.M{"billing_id": billingIdConvert})
	if err != nil {
		return err
	}
	return err
}
func (bm *billingMemberRepository) UpdateBillingMemberByBillingID(ctx context.Context, memberID string) error {
	MemberObjectID, _ := primitive.ObjectIDFromHex(memberID)

	filter := bson.D{{"billing_id", MemberObjectID}, {"charged_member_id", MemberObjectID}}

	update := bson.D{{"$set", bson.D{{"status", "paid"}}}}

	_, err := bm.db.Database("billing").Collection("billing_members").UpdateMany(ctx, filter, update)

	return err
}

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

func (bm *billingMemberRepository) GetBillingMemberByBillingID(ctx context.Context, id string)  (*entity.BillingMember, error){
	objectId, err := primitive.ObjectIDFromHex(id)

	if err != nil {
		return nil, utils.ErrorInvalidPrimitiveID
	}

	var billingMembers *entity.BillingMember
	curr,_ := bm.db.Database("billing").Collection("billing_members").Find(context.TODO(), bson.M{"billing_id": objectId})

	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, utils.ErrNoDocument
		}
		return nil, err
	}

	if err = curr.All(context.TODO(), billingMembers); err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, utils.ErrNoDocument
		}
		return nil, err
	}
	// for curr.Next(context.TODO()) {
	// 	err := curr.Decode(&billingMembers)

	// 	if err != nil {
	// 		if err == mongo.ErrNoDocuments {
	// 			return nil, utils.ErrNoDocument
	// 		}
	// 		return nil, err
	// 	}
	// }

	if err := curr.Err(); err != nil {
 		 return nil, err
	}
	fmt.Println(billingMembers)
	return billingMembers, nil
}
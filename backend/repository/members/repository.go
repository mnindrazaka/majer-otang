package members

import (
	"context"
	"github.com/mnindrazaka/billing/core/entity"
	"github.com/mnindrazaka/billing/core/repository"
	"github.com/mnindrazaka/billing/utils"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type memberRepository struct {
	db *mongo.Client
}

func NewMemberRepository(cfg *mongo.Client) repository.MemberRepository {
	return &memberRepository{cfg}
}

func (m *memberRepository) GetMemberByID(ctx context.Context, id string) (*entity.Member, error) {
	objectId, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return nil, utils.ErrorInvalidPrimitiveID
	}

	var member *entity.Member
	err = m.db.Database("billing").
		Collection("members").
		FindOne(context.TODO(), bson.M{"_id": objectId}).
		Decode(&member)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, utils.ErrNoDocument
		}
		return nil, err
	}

	return member, nil
}

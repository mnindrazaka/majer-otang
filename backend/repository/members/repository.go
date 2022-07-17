package members

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

func (m *memberRepository) GetMemberList(ctx context.Context) ([]entity.Member, error) {
	// var member *entity.Member
	var allMembers []entity.Member

	cursor, err := m.db.Database("billing").Collection("members").Find(context.TODO(), bson.D{})
		if err != nil {
			if err == mongo.ErrNoDocuments{
				return nil, utils.ErrNoDocument
			}
			return nil, err
		}
	fmt.Print(cursor)

	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()){
		// To decode into a struct, use cursor.Decode()
		result := &entity.Member{}
		err := cursor.Decode(&result)
		if err != nil {
			if err == mongo.ErrNoDocuments{
				return nil, utils.ErrNoDocument
			}
			return nil, err
		}
		
		allMembers = append(allMembers, *result)
	}
	if err := cursor.Err(); err != nil {
		if err == mongo.ErrNoDocuments{
				return nil, utils.ErrNoDocument
			}
			return nil, err
	}

	return allMembers, err	
}

package entity

import (
	"errors"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

var (
	ErrorNoDocument         = errors.New("no Document Found")
	ErrorInvalidPrimitiveID = errors.New("error Convert Primitive Object ID")
)

type Member struct {
	ID   primitive.ObjectID `bson:"_id"`
	Name string             `bson:"name"`
}

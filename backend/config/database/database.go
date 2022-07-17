package database

import (
	"context"
	"github.com/mnindrazaka/billing/config"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func Init(cfg config.Config) (*mongo.Client, error) {
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(cfg.DatabaseUrl))
	if err != nil {
		return nil, err
	}

	return client, nil
}

package config

import (
	"fmt"
	"os"
)

const (
	Port        = "PORT"
	Username    = "USERNAME"
	Password    = "PASSWORD"
	DatabaseURL = "MONGODATABASEURL"
)

type Config struct {
	Port        string
	Username    string
	Password    string
	DatabaseUrl string
}

func Get() Config {
	return Config{
		Port:        os.Getenv(Port),
		Username:    os.Getenv(Username),
		Password:    os.Getenv(Password),
		DatabaseUrl: fmt.Sprintf(os.Getenv(DatabaseURL), os.Getenv(Username), os.Getenv(Password)),
	}
}

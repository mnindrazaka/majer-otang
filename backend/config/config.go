package config

type Config struct {
	Host     string
	Username string
	Password string
}

func Get() Config {
	return Config{}
}

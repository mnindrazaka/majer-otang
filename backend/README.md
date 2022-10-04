# Backend Service for Billing App

## Mongo Driver Client

https://www.mongodb.com/docs/drivers/go/current/quick-start/

## HTTP Routing Library

https://github.com/julienschmidt/httprouter

## database credentials

- username : milhamsuryapratama
- password : ilhammongodb
- example : mongodb+srv://<username>:<password>@cluster0.8z2z3jv.mongodb.net/?retryWrites=true&w=majority

## how to run project on your local env

1. Make sure you're on the backend folder
2. Run project using this command:  
   `go run main.go`
3. Access project on http://localhost:{your_port}
4. To use another HTTP method, access the project on postman and define the HTTP method you want

## how to generate entity from api.json

Note: Make sure you're on the root project. And use your Open API generator command. Here, I use OPEN API generator CLI

1. If you have been pulled the project, run `go mod tidy` first
2. Then run `openapi-generator-cli generate -i backend/api.json -g go -o backend/core/entity --global-property models --package-name entity`

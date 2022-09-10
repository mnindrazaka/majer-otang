FROM golang:1.17-alpine
WORKDIR /app
COPY . .

RUN apk add openjdk8
RUN wget https://repo1.maven.org/maven2/org/openapitools/openapi-generator-cli/6.0.1/openapi-generator-cli-6.0.1.jar -O openapi-generator-cli.jar
RUN java -jar openapi-generator-cli.jar generate -i api.json -g go -o core/entity --global-property models --package-name entity

RUN go mod download
RUN go build

CMD [ "go", "run", "main.go" ]
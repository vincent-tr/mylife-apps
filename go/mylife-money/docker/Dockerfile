FROM golang:1.24 AS build

WORKDIR /src
COPY . .

WORKDIR /src/go/mylife-money
RUN go mod download
# RUN go vet -v
# RUN go test -v

RUN CGO_ENABLED=0 go build -o /src/mylife-money main.go

FROM gcr.io/distroless/static-debian11

COPY --from=build /src/mylife-money /
COPY --from=build /src/go/mylife-money/config.yaml /
ENTRYPOINT ["/mylife-money", "web"]

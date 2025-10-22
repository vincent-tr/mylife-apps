FROM golang:1.24 AS build

WORKDIR /src
COPY . .

WORKDIR /src/mylife-money/server
RUN go mod download
# RUN go vet -v
# RUN go test -v

RUN CGO_ENABLED=0 go build -o /bin/mylife-money main.go

FROM gcr.io/distroless/static-debian11

COPY --from=build /bin/mylife-money /
COPY --from=build /src/mylife-money/server/config.yaml /
ENTRYPOINT ["/mylife-money", "web"]

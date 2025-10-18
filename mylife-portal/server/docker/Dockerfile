FROM golang:1.24 AS build

WORKDIR /src
COPY . .

WORKDIR /src/mylife-portal/server
RUN go mod download
# RUN go vet -v
# RUN go test -v

RUN CGO_ENABLED=0 go build -o /src/mylife-portal main.go

FROM gcr.io/distroless/static-debian11

COPY --from=build /src/mylife-portal /
COPY --from=build /src/mylife-portal/server/config.yaml /
ENTRYPOINT ["/mylife-portal", "web"]

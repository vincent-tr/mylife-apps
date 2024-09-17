FROM golang:1.23 as build

WORKDIR /src
COPY . .

WORKDIR /src/go/mylife-portal
RUN go mod download
# RUN go vet -v
# RUN go test -v

RUN CGO_ENABLED=0 go build -o /src/mylife-portal main.go

FROM gcr.io/distroless/static-debian11

COPY --from=build /src/mylife-portal /
COPY --from=build /src/go/mylife-portal/config.yaml /
ENTRYPOINT ["/mylife-portal", "web"]

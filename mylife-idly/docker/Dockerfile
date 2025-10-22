FROM golang:1.24 AS build

WORKDIR /src
COPY . .

WORKDIR /src/mylife-idly/server
RUN go mod download
# RUN go vet -v
# RUN go test -v

RUN CGO_ENABLED=0 go build -o /bin/mylife-idly main.go

FROM gcr.io/distroless/static-debian11

COPY --from=build /bin/mylife-idly /
COPY --from=build /src/mylife-idly/server/config.yaml /
ENTRYPOINT ["/mylife-idly", "web"]

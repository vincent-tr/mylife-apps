FROM golang:1.24 AS build

WORKDIR /src
COPY . .

WORKDIR /src/go/mylife-energy
RUN go mod download
# RUN go vet -v
# RUN go test -v

RUN CGO_ENABLED=0 go build -o /src/mylife-energy main.go

FROM gcr.io/distroless/static-debian11

COPY --from=build /src/mylife-energy /
COPY --from=build /src/go/mylife-energy/config.yaml /
ENTRYPOINT ["/mylife-energy"]

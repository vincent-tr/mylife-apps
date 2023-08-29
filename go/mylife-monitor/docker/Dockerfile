FROM golang:1.20 as build

WORKDIR /src
COPY . .

WORKDIR /src/go/mylife-monitor
RUN go mod download
# RUN go vet -v
# RUN go test -v

RUN CGO_ENABLED=0 go build -o /src/mylife-monitor main.go

FROM gcr.io/distroless/static-debian11

COPY --from=build /src/mylife-monitor /
COPY --from=build /src/go/mylife-monitor/config.yaml /
ENTRYPOINT ["/mylife-monitor", "web"]

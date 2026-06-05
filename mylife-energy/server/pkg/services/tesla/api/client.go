package api

import (
	"context"
	"mylife-tools/log"
)

var logger = log.CreateLogger("mylife:energy:tesla:api")

// TODO: No Wakeup using BLE

type Config struct {
	// Must contain (fleet-api.token), owner-api.token, vehicle-private-key.pem
	AuthPath string
	// FleetClientId string
	Id       int64
	VIN      string
	BleProxy string
}

type Client struct {
	bleProxy *bleProxyClient
}

func MakeClient(ctx context.Context, config *Config) (*Client, error) {
	client := &Client{}
	var err error

	client.bleProxy, err = makeBleProxyClient(config)
	if err != nil {
		return nil, err
	}

	return client, nil
}

func (client *Client) FetchChargeData() (*ChargeData, error) {
	return client.bleProxy.FetchChargeData()
}

func (client *Client) Wakeup() error {
	return client.bleProxy.Wakeup()
}

func (client *Client) SetupCharge(current int, limit int) error {
	return client.bleProxy.SetupCharge(current, limit)
}

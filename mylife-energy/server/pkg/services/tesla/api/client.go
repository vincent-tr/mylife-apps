package api

import (
	"context"
	"mylife-tools-server/log"
)

var logger = log.CreateLogger("mylife:energy:tesla:api")

// TODO:
// - gerer quand sleeping/injoignable => http 408
// - Status trouver les autres
// - Tester vehicle.Wakeup()
// - Tester set charge current

type Config struct {
	// Must contain (fleet-api.token), owner-api.token, vehicle-private-key.pem
	AuthPath string
	// FleetClientId string
	Id       int64
	VIN      string
	BleProxy string
}

type Client struct {
	owner    *ownerClient
	bleProxy *bleProxyClient
}

func MakeClient(ctx context.Context, config *Config) (*Client, error) {
	client := &Client{}
	var err error

	client.owner, err = makeOwnerClient(ctx, config)
	if err != nil {
		return nil, err
	}

	client.bleProxy, err = makeBleProxyClient(config)
	if err != nil {
		return nil, err
	}

	return client, nil
}

func (client *Client) FetchChargeData() (*ChargeData, error) {
	return client.owner.FetchChargeData()
}

func (client *Client) Wakeup() error {
	return client.bleProxy.Wakeup()
}

func (client *Client) SetupCharge(current int, limit int) error {
	return client.bleProxy.SetupCharge(current, limit)
}

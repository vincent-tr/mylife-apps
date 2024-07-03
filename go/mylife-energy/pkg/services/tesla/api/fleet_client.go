package api

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"path"
	"time"

	"github.com/teslamotors/vehicle-command/pkg/account"
	"github.com/teslamotors/vehicle-command/pkg/protocol"
	"github.com/teslamotors/vehicle-command/pkg/vehicle"
	"golang.org/x/oauth2"
)

const wakeupTimeout = time.Second * 30
const commandTimeout = time.Second * 10

type fleetClient struct {
	vehicle *vehicle.Vehicle
}

func makeFleetClient(ctx context.Context, config *Config) (*fleetClient, error) {
	privKeyFile := path.Join(config.AuthPath, "vehicle-private-key.pem")
	tokenFile := path.Join(config.AuthPath, "owner-api.token")

	privateKey, err := protocol.LoadPrivateKey(privKeyFile)
	if err != nil {
		return nil, fmt.Errorf("failed to load private key: %w", err)
	}

	oauthTokenBin, err := os.ReadFile(tokenFile)
	if err != nil {
		return nil, fmt.Errorf("failed to load OAuth token: %w", err)
	}

	oauthToken := new(oauth2.Token)
	if err := json.Unmarshal(oauthTokenBin, oauthToken); err != nil {
		return nil, fmt.Errorf("failed to unmarshall OAuth token: %w", err)
	}

	acct, err := account.New(oauthToken.AccessToken, "")
	if err != nil {
		return nil, fmt.Errorf("authentication error: %w", err)
	}

	veh, err := acct.GetVehicle(ctx, config.VIN, privateKey, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch vehicle info from account: %w", err)
	}

	return &fleetClient{
		vehicle: veh,
	}, nil
}

func (client *fleetClient) Wakeup() error {
	ctx, cancel := context.WithTimeout(context.Background(), wakeupTimeout)
	defer cancel()

	return client.vehicle.Wakeup(ctx)
}

func (client *fleetClient) SetChargingCurrent(value int) error {
	ctx, cancel := context.WithTimeout(context.Background(), commandTimeout)
	defer cancel()

	if err := client.vehicle.Connect(ctx); err != nil {
		return err
	}

	defer client.vehicle.Disconnect()

	if value == 0 {
		err := client.vehicle.ChargeStop(ctx)
		if err != nil && err.Error() != "not_charging" {
			return err
		}

		return nil
	}

	err := client.vehicle.ChargeStart(ctx)
	if err != nil && err.Error() != "is_charging" {
		return err
	}

	err = client.vehicle.SetChargingAmps(ctx, int32(value))
	return err
}

func (client *fleetClient) SetChargeLimit(percent int) error {
	ctx, cancel := context.WithTimeout(context.Background(), commandTimeout)
	defer cancel()

	if err := client.vehicle.Connect(ctx); err != nil {
		return err
	}

	defer client.vehicle.Disconnect()

	return client.vehicle.ChangeChargeLimit(ctx, int32(percent))
}

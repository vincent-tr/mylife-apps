package api

import (
	"context"
	"encoding/json"
	"fmt"
	"os"
	"path"
	"strings"
	"time"

	"github.com/teslamotors/vehicle-command/pkg/account"
	"github.com/teslamotors/vehicle-command/pkg/protocol"
	"github.com/teslamotors/vehicle-command/pkg/vehicle"
	"golang.org/x/oauth2"
)

const wakeupTimeout = time.Minute
const commandTimeout = time.Minute
const tokenUrl = "https://auth.tesla.com/oauth2/v3/token"

// TODO: cache connections?

type fleetClient struct {
	vin         string
	privateKey  protocol.ECDHPrivateKey
	tokenSource oauth2.TokenSource
}

func makeFleetClient(config *Config) (*fleetClient, error) {
	privKeyFile := path.Join(config.AuthPath, "vehicle-private-key.pem")
	tokenFile := path.Join(config.AuthPath, "fleet-api.token")

	privateKey, err := protocol.LoadPrivateKey(privKeyFile)
	if err != nil {
		return nil, fmt.Errorf("failed to load private key: %w", err)
	}

	oauthTokenBin, err := os.ReadFile(tokenFile)
	if err != nil {
		return nil, fmt.Errorf("failed to load OAuth token: %w", err)
	}

	oauthToken := &oauth2.Token{}
	if err := json.Unmarshal(oauthTokenBin, oauthToken); err != nil {
		return nil, fmt.Errorf("failed to unmarshall OAuth token: %w", err)
	}

	// Mark it as expired already (since the file is not tracking expirity properly)
	oauthToken.Expiry = time.Now()

	conf := &oauth2.Config{
		ClientID: config.FleetClientId,
		Endpoint: oauth2.Endpoint{
			TokenURL: tokenUrl,
		},
	}

	tokenSource := conf.TokenSource(context.Background(), oauthToken)

	return &fleetClient{
		vin:         config.VIN,
		privateKey:  privateKey,
		tokenSource: tokenSource,
	}, nil
}

func (client *fleetClient) getVehicle(ctx context.Context) (*vehicle.Vehicle, error) {
	newToken, err := client.tokenSource.Token()
	if err != nil {
		return nil, fmt.Errorf("oauth2 token error: %w", err)
	}

	acct, err := account.New(newToken.AccessToken, "")
	if err != nil {
		return nil, fmt.Errorf("authentication error: %w", err)
	}

	veh, err := acct.GetVehicle(ctx, client.vin, client.privateKey, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch vehicle info from account: %w", err)
	}

	return veh, nil
}

func (client *fleetClient) Wakeup() error {
	ctx, cancel := context.WithTimeout(context.Background(), wakeupTimeout)
	defer cancel()

	veh, err := client.getVehicle(ctx)
	if err != nil {
		return err
	}

	logger.Debug("Got vehicle")

	return veh.Wakeup(ctx)
}

func (client *fleetClient) SetupCharge(current int, limit int) error {
	ctx, cancel := context.WithTimeout(context.Background(), commandTimeout)
	defer cancel()

	veh, err := client.getVehicle(ctx)
	if err != nil {
		return err
	}

	logger.Debug("Got vehicle")

	if err := veh.Connect(ctx); err != nil {
		return err
	}

	defer veh.Disconnect()

	logger.Debug("Connected to vehicle")

	if err := veh.StartSession(ctx, nil); err != nil {
		return err
	}

	if current == 0 {
		err := veh.ChargeStop(ctx)
		if err != nil && !strings.Contains(err.Error(), "not_charging") {
			return err
		}

		logger.Debug("Charge stopped")
	} else {
		err := veh.ChargeStart(ctx)
		if err != nil && !strings.Contains(err.Error(), "is_charging") {
			return err
		}

		logger.Debug("Charge started")

		err = veh.SetChargingAmps(ctx, int32(current))
		if err != nil {
			return err
		}

		logger.Debug("Charge current set")
	}

	if err := veh.ChangeChargeLimit(ctx, int32(limit)); err != nil {
		return err
	}

	logger.Debug("Charge limit set")

	return nil
}

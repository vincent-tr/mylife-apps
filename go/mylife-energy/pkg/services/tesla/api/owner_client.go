package api

import (
	"context"
	"fmt"
	"path"

	"github.com/bogosj/tesla"
)

// https://pkg.go.dev/github.com/bogosj/tesla#WithBaseURL
// https://github.com/bogosj/tesla/blob/v1.1.0/examples/manage_car.go
// https://tesla-api.timdorr.com/api-basics/vehicles

type ownerClient struct {
	vehicle *tesla.Vehicle
}

func makeOwnerClient(ctx context.Context, config *Config) (*ownerClient, error) {
	tokenFile := path.Join(config.AuthPath, "owner-api.token")
	client, err := tesla.NewClient(ctx, tesla.WithTokenFile(tokenFile))
	if err != nil {
		return nil, fmt.Errorf("cannot make new client: %w", err)
	}

	vehicle, err := lookupVehicule(client, config.Id)

	if err != nil {
		return nil, err
	}

	// Note: will fail to start if car is sleeping. Disable for now.
	// status, err := vehicle.MobileEnabled()
	// if err != nil {
	// 	return nil, fmt.Errorf("cannot access MobileEnabled: %w", err)
	// }
	//
	// if !status {
	// 	return nil, fmt.Errorf("mobile access disabled")
	// }

	return &ownerClient{
		vehicle: vehicle,
	}, nil
}

func lookupVehicule(client *tesla.Client, id int64) (*tesla.Vehicle, error) {
	vehicle, err := client.Vehicle(id)
	if err != nil {
		return nil, fmt.Errorf("cannot get vehicle: %w", err)
	}

	logger.Debugf("VIN: %s, Name: '%s', ID: %d, API version: %d\n", vehicle.Vin, vehicle.DisplayName, vehicle.ID, vehicle.APIVersion)

	return vehicle, nil
}

func (client *ownerClient) FetchChargeData() (*ChargeData, error) {

	data, err := client.vehicle.Data()
	if err != nil {
		return nil, err
	}

	if data.Error != "" {
		return nil, fmt.Errorf("got data.error: %s %s", data.Error, data.ErrorDescription)
	}

	return newChargeData(&data.Response.ChargeState), nil
}

/*
func (client *ownerClient) Wakeup() error {
	_, err := client.vehicle.Wakeup()
	return err
}

func (client *ownerClient) SetChargingCurrent(value int) error {
	if value == 0 {
		err := client.vehicle.StopCharging()
		if err != nil && err.Error() != "not_charging" {
			return err
		}

		return nil
	}

	err := client.vehicle.StartCharging()
	if err != nil && err.Error() != "is_charging" {
		return err
	}

	err = client.vehicle.SetChargingAmps(value)
	return err
}

func (client *ownerClient) SetChargeLimit(percent int) error {
	return client.vehicle.SetChargeLimit(percent)
}
*/

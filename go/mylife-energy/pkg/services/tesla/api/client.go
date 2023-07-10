package api

import (
	"context"
	"fmt"
	"math"
	"mylife-tools-server/log"

	"github.com/bogosj/tesla"
)

var logger = log.CreateLogger("mylife:energy:tesla:api")

// https://pkg.go.dev/github.com/bogosj/tesla#WithBaseURL
// https://github.com/bogosj/tesla/blob/v1.1.0/examples/manage_car.go
// https://tesla-api.timdorr.com/api-basics/vehicles

// TODO:
// - gerer quand sleeping/injoignable => http 408
// - Status trouver les autres
// - Tester vehicle.Wakeup()
// - Tester set charge current

type teslaConfig struct {
	TokenPath    string `mapstructure:"tokenPath"`
	VIN          string `mapstructure:"vin"`
	HomeLocation string `mapstructure:"homeLocation"` // 'latitude longitude'
}

type Client struct {
	homeLocation Position
	vehicle      *tesla.Vehicle
}

func MakeClient(ctx context.Context, tokenPath string, vin string, homeLocation Position) (*Client, error) {
	client, err := tesla.NewClient(context.TODO(), tesla.WithTokenFile(tokenPath))
	if err != nil {
		return nil, fmt.Errorf("Cannot make new client: %w", err)
	}

	vehicle, err := lookupVehicule(client, vin)

	if err != nil {
		return nil, err
	}

	status, err := vehicle.MobileEnabled()
	if err != nil {
		return nil, fmt.Errorf("Cannot access MobileEnabled: %w", err)
	}

	if !status {
		return nil, fmt.Errorf("Mobile access disabled")
	}

	return &Client{
		homeLocation: homeLocation,
		vehicle:      vehicle,
	}, nil
}

func lookupVehicule(client *tesla.Client, vin string) (*tesla.Vehicle, error) {
	vehicles, err := client.Vehicles()
	if err != nil {
		return nil, fmt.Errorf("Cannot get vehicles: %w", err)
	}

	for _, vehicle := range vehicles {
		logger.Debugf("VIN: %s, Name: '%s', ID: %d, API version: %d\n", vehicle.Vin, vehicle.DisplayName, vehicle.ID, vehicle.APIVersion)

		if vehicle.Vin == vin {
			return vehicle, nil
		}
	}

	return nil, fmt.Errorf("Vehicle with VIN '%s' not found", vin)
}

func (client *Client) FetchChargeData() (*ChargeData, error) {

	data, err := client.vehicle.Data()
	if err != nil {
		return nil, err
	}

	if data.Error != "" {
		return nil, fmt.Errorf("Got data.error: %s %s", data.Error, data.ErrorDescription)
	}

	return newChargeData(&data.Response.ChargeState, client.isAtHome(&data.Response.DriveState)), nil
}

func (client *Client) isAtHome(state *tesla.DriveState) bool {
	const maxDistance = 50 // meters

	if state.Speed > 0 {
		return false
	}

	curPos := Position{
		lat:  state.Latitude,
		long: state.Longitude,
	}

	dist := distance(client.homeLocation, curPos)

	return dist <= maxDistance
}

// https://gist.github.com/hotdang-ca/6c1ee75c48e515aec5bc6db6e3265e49
func distance(pos1 Position, pos2 Position) float64 {
	radlat1 := float64(math.Pi * pos1.lat / 180)
	radlat2 := float64(math.Pi * pos2.lat / 180)

	theta := float64(pos1.long - pos2.long)
	radtheta := float64(math.Pi * theta / 180)

	dist := math.Sin(radlat1)*math.Sin(radlat2) + math.Cos(radlat1)*math.Cos(radlat2)*math.Cos(radtheta)
	if dist > 1 {
		dist = 1
	}

	dist = math.Acos(dist)
	dist = dist * 180 / math.Pi
	dist = dist * 60 * 1.1515 * 1.609344 * 1000 // M->KM then KM->M

	return dist
}

func (client *Client) Wakeup() error {
	_, err := client.vehicle.Wakeup()
	return err
}

func (client *Client) SetChargingCurrent(value int) error {
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

	return client.vehicle.SetChargingAmps(value)
}

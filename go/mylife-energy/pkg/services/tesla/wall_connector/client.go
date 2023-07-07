package wall_connector

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"mylife-tools-server/log"
	"net/http"
	"time"
)

var logger = log.CreateLogger("mylife:energy:tesla:wall-connector")

type Data struct {
	Timestamp        time.Time
	ContactorClosed  bool          // Is the contector closed
	VehicleConnected bool          // Is the vehicle connected
	Session          time.Duration // Current session time
	SessionEnergyWh  float64       // Amount of energy delivered by the wall connector during this session
	Uptime           time.Duration // Uptime in seconds
	Voltage          float64       // Measured voltage
	Current          float64       // Measured current
	Temperature      float64       // Handle Temperature
	CurrentAlerts    []string      // Current alerts
}

type Client struct {
	context context.Context
	address string
}

func MakeClient(ctx context.Context, address string) *Client {
	client := &Client{
		context: ctx,
		address: address,
	}

	client.printInitData()

	return client
}

func (client *Client) FetchData() (*Data, error) {

	vitals := &vitals{}

	if err := client.fetchItem("vitals", vitals); err != nil {
		return nil, err
	}

	return &Data{
		Timestamp:        time.Now(),
		ContactorClosed:  vitals.ContactorClosed,
		VehicleConnected: vitals.VehicleConnected,
		Session:          makeDurationFromSeconds(vitals.SessionS),
		SessionEnergyWh:  vitals.SessionEnergyWh,
		Uptime:           makeDurationFromSeconds(vitals.UptimeS),
		Voltage:          vitals.GridV,
		Current:          vitals.CurrentAA,
		Temperature:      vitals.HandleTempC,
		CurrentAlerts:    vitals.CurrentAlerts,
	}, nil
}

func (client *Client) printInitData() {
	version := &version{}
	lifetime := &lifetime{}

	if err := client.fetchItem("version", version); err != nil {
		logger.WithError(err).Error("Could not fetch wall connector version")
		return
	}

	if err := client.fetchItem("lifetime", lifetime); err != nil {
		logger.WithError(err).Error("Could not fetch wall connector lifetime data")
		return
	}

	logger.Infof("Wall connector version: '%s', part number='%s', serial='%s'",
		version.FirmwareVersion, version.PartNumber, version.SerialNumber)

	logger.Infof("Wall connector lifetime: %s uptime, got %d alerts, %d started charges, %s total charging time",
		makeDurationFromSeconds(lifetime.UptimeS), lifetime.AlertCount, lifetime.ChargeStarts, makeDurationFromSeconds(lifetime.ChargingTimeS))
}

func (client *Client) fetchItem(ep string, v any) error {
	req, err := http.NewRequestWithContext(client.context, "GET", fmt.Sprintf("http://%s/api/1/%s", client.address, ep), nil)
	if err != nil {
		return err
	}

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}

	defer resp.Body.Close()

	body, _ := ioutil.ReadAll(resp.Body)
	return json.Unmarshal(body, v)
}

func makeDurationFromSeconds(value uint64) time.Duration {
	return time.Duration(value) * time.Second
}

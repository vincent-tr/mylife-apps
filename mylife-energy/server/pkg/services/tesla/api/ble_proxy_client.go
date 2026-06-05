package api

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"path"
	"strings"
	"time"

	"mylife-tools/log"
)

const wakeupTimeout = time.Minute
const commandTimeout = time.Minute
const statusTimeout = time.Minute

type bleProxyClient struct {
	vin        string
	privateKey []byte
	proxy      string
}

func makeBleProxyClient(config *Config) (*bleProxyClient, error) {
	privKeyFile := path.Join(config.AuthPath, "vehicle-private-key.pem")

	privateKey, err := os.ReadFile(privKeyFile)
	if err != nil {
		return nil, fmt.Errorf("failed to load private key: %w", err)
	}

	return &bleProxyClient{
		vin:        config.VIN,
		privateKey: privateKey,
		proxy:      config.BleProxy,
	}, nil
}

func (client *bleProxyClient) FetchChargeData() (*ChargeData, error) {
	ctx, cancel := context.WithTimeout(context.Background(), statusTimeout)
	defer cancel()

	status, err := client.runRequest(ctx, "GET", "/charging-state", nil)
	if err != nil {
		return nil, err
	}

	if status == nil {
		return nil, fmt.Errorf("unexpected nil status")
	}

	var cs ChargingState
	if err = json.Unmarshal(status, &cs); err != nil {
		return nil, err
	}

	res := &ChargeData{
		Timestamp: time.Now(),
		Status:    ChargeStatus(cs.Status),
		Charger: Charger{
			MaxCurrent: cs.ChargerMaxCurrent,
			Current:    cs.ChargerCurrent,
			Power:      cs.ChargerPower,
			Voltage:    cs.ChargerVoltage,
		},
		Battery: Battery{
			Level:       cs.BatteryLevel,
			TargetLevel: cs.BatteryTargetLevel,
		},
		Charge: Charge{
			MinCurrent:     5, // No data, always 0: cs.ChargeMinCurrent,
			MaxCurrent:     cs.ChargeMaxCurrent,
			RequestCurrent: cs.ChargeRequestCurrent,
			Current:        cs.ChargeCurrent,
			TimeLeft:       cs.ChargeTimeLeft,
		},
	}

	return res, nil
}

func (client *bleProxyClient) Wakeup() error {
	ctx, cancel := context.WithTimeout(context.Background(), wakeupTimeout)
	defer cancel()

	_, err := client.runRequest(ctx, "POST", "/wakeup", nil)
	return err
}

func (client *bleProxyClient) SetupCharge(current int, limit int) error {
	ctx, cancel := context.WithTimeout(context.Background(), commandTimeout)
	defer cancel()

	if current == 0 {
		err := client.ChargeStop(ctx)
		if err != nil && !strings.Contains(err.Error(), "not_charging") {
			return err
		}

		logger.Debug("Charge stopped")
	} else {
		err := client.ChargeStart(ctx)
		if err != nil && !strings.Contains(err.Error(), "is_charging") {
			return err
		}

		logger.Debug("Charge started")

		err = client.SetChargingAmps(ctx, int32(current))
		if err != nil {
			return err
		}

		logger.Debug("Charge current set")
	}

	if err := client.ChangeChargeLimit(ctx, int32(limit)); err != nil && !strings.Contains(err.Error(), "already_set") {
		return err
	}

	logger.Debug("Charge limit set")

	return nil
}

func (client *bleProxyClient) ChargeStart(ctx context.Context) error {
	_, err := client.runRequest(ctx, "POST", "/charge-start", nil)
	return err
}

func (client *bleProxyClient) ChargeStop(ctx context.Context) error {
	_, err := client.runRequest(ctx, "POST", "/charge-stop", nil)
	return err
}

func (client *bleProxyClient) SetChargingAmps(ctx context.Context, amps int32) error {
	_, err := client.runRequest(ctx, "POST", "/set-charging-amps", &SetChargingAmpsRequest{Amps: amps})
	return err
}

func (client *bleProxyClient) ChangeChargeLimit(ctx context.Context, chargeLimitPercent int32) error {
	_, err := client.runRequest(ctx, "POST", "/change-charge-limit", &ChangeChargeLimitRequest{ChargeLimitPercent: chargeLimitPercent})
	return err
}

func (client *bleProxyClient) runRequest(ctx context.Context, method string, path string, reqObj any) (json.RawMessage, error) {
	rs, err := client.doRequest(ctx, method, path, reqObj)
	if err != nil {
		return nil, err
	}

	if client.authNeeded(rs) {
		if err := client.doAuth(ctx); err != nil {
			return nil, err
		}

		rs, err = client.doRequest(ctx, method, path, reqObj)
		if err != nil {
			return nil, err
		}
	}

	return client.processResponse(rs)
}

func (client *bleProxyClient) authNeeded(rs *responseData) bool {
	return rs.status == http.StatusUnauthorized && rs.data != nil && rs.data.Code == ResponseCredentialsNeeded
}

func (client *bleProxyClient) processResponse(rs *responseData) (json.RawMessage, error) {
	if rs.status == http.StatusOK {
		var status json.RawMessage
		if rs.data != nil {
			status = rs.data.Status
		}

		return status, nil
	}

	if rs.data == nil {
		return nil, fmt.Errorf("unknown error (http status=%d)", rs.status)
	}

	return nil, fmt.Errorf("%s (code=%s, http status=%d)", rs.data.Message, rs.data.Code, rs.status)
}

func (client *bleProxyClient) doAuth(ctx context.Context) error {
	creds := CarCredentialsRequest{
		PrivateKey: client.privateKey,
		VIN:        client.vin,
	}

	rs, err := client.doRequest(ctx, "POST", "/car-credentials", &creds)
	if err != nil {
		return err
	}

	_, err = client.processResponse(rs)
	return err
}

func (client *bleProxyClient) doRequest(ctx context.Context, method string, path string, reqObj any) (*responseData, error) {
	var data []byte

	if reqObj != nil {
		jsonStr, err := json.Marshal(reqObj)
		if err != nil {
			return nil, err
		}

		data = jsonStr
	}

	url := "http://" + client.proxy + path

	logger.WithFields(log.Fields{"url": url, "reqObj": reqObj}).Debug("running request")

	req, err := http.NewRequestWithContext(ctx, method, url, bytes.NewBuffer(data))
	if err != nil {
		return nil, err
	}

	if reqObj != nil {
		req.Header.Set("Content-Type", "application/json")
	}

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	logger.WithFields(log.Fields{"body": string(body), "status": resp.StatusCode}).Debug("response")

	rs := &responseData{
		status: resp.StatusCode,
	}

	if len(body) > 0 {
		rs.data = &Response{}
		if err := json.Unmarshal(body, rs.data); err != nil {
			return nil, err
		}
	}

	return rs, nil
}

type responseData struct {
	status int
	data   *Response
}

// TODO: share with server

type CarCredentialsRequest struct {
	PrivateKey []byte `json:"privateKey"`
	VIN        string `json:"vin"`
}

type SetChargingAmpsRequest struct {
	Amps int32 `json:"amps"`
}

type ChangeChargeLimitRequest struct {
	ChargeLimitPercent int32 `json:"chargeLimitPercent"`
}

type ChargingState struct {
	Status               string `json:"status"`               // One of: Charging, Stopped, Complete, Disconnected,
	ChargerMaxCurrent    int    `json:"chargerMaxCurrent"`    // Max charger current (A)
	ChargerCurrent       int    `json:"chargerCurrent"`       // Actual charger current (A)
	ChargerPower         int    `json:"chargerPower"`         // Actual charger power (kW)
	ChargerVoltage       int    `json:"chargerVoltage"`       // Actual charger voltage (V)
	BatteryLevel         int    `json:"batteryLevel"`         // Actual battery level (%)
	BatteryTargetLevel   int    `json:"batteryTargetLevel"`   // Target battery level (%)
	ChargeMinCurrent     int    `json:"chargeMinCurrent"`     // Min possible current request (A)
	ChargeMaxCurrent     int    `json:"chargeMaxCurrent"`     // Max possible current request (A)
	ChargeRequestCurrent int    `json:"chargeRequestCurrent"` // Requested current (A)
	ChargeCurrent        int    `json:"chargeCurrent"`        // Actual current (A)
	ChargeTimeLeft       int    `json:"chargeTimeLeft"`       // Time until full charge (Minutes)
}

type ResponseCode string

const ResponseCredentialsNeeded ResponseCode = "credentials-needed"
const ResponseError ResponseCode = "error"
const ResponseOK ResponseCode = "success"

type Response struct {
	Code    ResponseCode    `json:"code"`
	Message string          `json:"message"`
	Status  json.RawMessage `json:"status"`
}

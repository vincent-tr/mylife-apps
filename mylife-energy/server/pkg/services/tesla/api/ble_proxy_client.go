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

func (client *bleProxyClient) Wakeup() error {
	ctx, cancel := context.WithTimeout(context.Background(), wakeupTimeout)
	defer cancel()

	return client.runCommand(ctx, "/wakeup", nil)
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
	return client.runCommand(ctx, "/charge-start", nil)
}

func (client *bleProxyClient) ChargeStop(ctx context.Context) error {
	return client.runCommand(ctx, "/charge-stop", nil)
}

func (client *bleProxyClient) SetChargingAmps(ctx context.Context, amps int32) error {
	return client.runCommand(ctx, "/set-charging-amps", &SetChargingAmpsRequest{Amps: amps})
}

func (client *bleProxyClient) ChangeChargeLimit(ctx context.Context, chargeLimitPercent int32) error {
	return client.runCommand(ctx, "/change-charge-limit", &ChangeChargeLimitRequest{ChargeLimitPercent: chargeLimitPercent})
}

func (client *bleProxyClient) runCommand(ctx context.Context, path string, reqObj any) error {
	rs, err := client.doPost(ctx, path, reqObj)
	if err != nil {
		return err
	}

	if client.authNeeded(rs) {
		if err := client.doAuth(ctx); err != nil {
			return err
		}

		rs, err = client.doPost(ctx, path, reqObj)
		if err != nil {
			return err
		}
	}

	return client.responseToErr(rs)
}

func (client *bleProxyClient) authNeeded(rs *responseData) bool {
	return rs.status == http.StatusUnauthorized && rs.data != nil && rs.data.Code == ResponseCredentialsNeeded
}

func (client *bleProxyClient) responseToErr(rs *responseData) error {
	if rs.status == http.StatusOK {
		return nil
	}

	if rs.data == nil {
		return fmt.Errorf("unknown error (http status=%d)", rs.status)
	}

	return fmt.Errorf("%s (code=%s, http status=%d)", rs.data.Message, rs.data.Code, rs.status)
}

func (client *bleProxyClient) doAuth(ctx context.Context) error {
	creds := CarCredentialsRequest{
		PrivateKey: client.privateKey,
		VIN:        client.vin,
	}

	rs, err := client.doPost(ctx, "/car-credentials", &creds)
	if err != nil {
		return err
	}

	return client.responseToErr(rs)
}

func (client *bleProxyClient) doPost(ctx context.Context, path string, reqObj any) (*responseData, error) {
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

	req, err := http.NewRequestWithContext(ctx, "POST", url, bytes.NewBuffer(data))
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

type ResponseCode string

const ResponseCredentialsNeeded ResponseCode = "credentials-needed"
const ResponseError ResponseCode = "error"
const ResponseOK ResponseCode = "success"

type Response struct {
	Code    ResponseCode `json:"code"`
	Message string       `json:"message"`
}

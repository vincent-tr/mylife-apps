package api

import (
	"time"

	"github.com/bogosj/tesla"
)

type ChargeStatus string

const (
	Charging     ChargeStatus = "Charging"
	Stopped      ChargeStatus = "Stopped"
	Complete     ChargeStatus = "Complete"
	Disconnected ChargeStatus = "Disconnected"
)

type ChargeData struct {
	Timestamp time.Time
	Status    ChargeStatus
	Charger   Charger
	Battery   Battery
	Charge    Charge
}

type Charger struct {
	MaxCurrent int // Max charger current (A)
	Current    int // Actual charger current (A)
	Power      int // Actual charger power (kW)
	Voltage    int // Actual charger voltage (V)
}

type Battery struct {
	Level       int // Actual battery level (%)
	TargetLevel int // Target battery level (%)
}

type Charge struct {
	MinCurrent     int // Min possible current request (A)
	MaxCurrent     int // Max possible current request (A)
	RequestCurrent int // Requested current (A)
	Current        int // Actual current (A)
	TimeLeft       int // Time until full charge (Minutes)
}

func newChargeData(chargeState *tesla.ChargeState) *ChargeData {
	const chargeMinCurrent = 5

	return &ChargeData{
		Timestamp: chargeState.Timestamp.Time,
		Status:    ChargeStatus(chargeState.ChargingState),
		Charger: Charger{
			MaxCurrent: chargeState.ChargerPilotCurrent,
			Current:    chargeState.ChargerActualCurrent,
			Power:      chargeState.ChargerPower,
			Voltage:    chargeState.ChargerVoltage,
		},
		Battery: Battery{
			Level:       chargeState.BatteryLevel,
			TargetLevel: chargeState.ChargeLimitSoc,
		},
		Charge: Charge{
			MinCurrent:     chargeMinCurrent,
			MaxCurrent:     chargeState.ChargeCurrentRequestMax,
			RequestCurrent: chargeState.ChargeCurrentRequest,
			Current:        chargeState.ChargeAmps,
			TimeLeft:       chargeState.MinutesToFullCharge,
		},
	}
}

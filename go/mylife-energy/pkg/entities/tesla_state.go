package entities

import (
	"mylife-tools-server/services/io/serialization"
	"time"
)

type TeslaMode uint

const (
	TeslaModeOff TeslaMode = iota
	TeslaModeFast
	TeslaModeSmart
)

type TeslaDeviceStatus uint

const (
	TeslaDeviceStatusUnknown TeslaDeviceStatus = iota
	TeslaDeviceStatusOnline
	TeslaDeviceStatusOffline
	TeslaDeviceStatusFailure
)

type TeslaChargingStatus uint

const (
	TeslaChargingStatusUnknown TeslaChargingStatus = iota
	TeslaChargingStatusCharging
	TeslaChargingStatusComplete
	TeslaChargingStatusNotAtHome
	TeslaChargingStatusNotPlugged
	TeslaChargingStatusNoPower  // mode smart only
	TeslaChargingStatusDisabled // mode off
)

type TeslaState struct {
	id                   string
	mode                 TeslaMode
	lastUpdate           time.Time
	wallConnectorStatus  TeslaDeviceStatus
	carStatus            TeslaDeviceStatus
	chargingStatus       TeslaChargingStatus
	chargingCurrent      int       // Actual current (A)
	chargingPower        int       // Actual charger power (kW)
	batteryLastTimestamp time.Time // Last time we could check battery level
	batteryLevel         int       // Actual battery level (%)
	batteryTargetLevel   int       // Target battery level (%)
}

func (state *TeslaState) Id() string {
	return state.id
}

func (state *TeslaState) Mode() TeslaMode {
	return state.mode
}

func (state *TeslaState) LastUpdate() time.Time {
	return state.lastUpdate
}

func (state *TeslaState) WallConnectorStatus() TeslaDeviceStatus {
	return state.wallConnectorStatus
}

func (state *TeslaState) CarStatus() TeslaDeviceStatus {
	return state.carStatus
}

func (state *TeslaState) ChargingStatus() TeslaChargingStatus {
	return state.chargingStatus
}

// Actual current (A)
func (state *TeslaState) ChargingCurrent() int {
	return state.chargingCurrent
}

// Actual charger power (kW)
func (state *TeslaState) ChargingPower() int {
	return state.chargingPower
}

// Last time we could check battery level
func (state *TeslaState) BatteryLastTimestamp() time.Time {
	return state.batteryLastTimestamp
}

// Actual battery level (%)
func (state *TeslaState) BatteryLevel() int {
	return state.batteryLevel
}

// Target battery level (%)
func (state *TeslaState) BatteryTargetLevel() int {
	return state.batteryTargetLevel
}

func (state *TeslaState) Marshal() (interface{}, error) {
	helper := serialization.NewStructMarshallerHelper()

	helper.Add("_id", state.id)
	helper.Add("mode", state.mode)
	helper.Add("lastUpdate", state.lastUpdate)
	helper.Add("wallConnectorStatus", state.wallConnectorStatus)
	helper.Add("carStatus", state.carStatus)
	helper.Add("chargingStatus", state.chargingStatus)
	helper.Add("chargingCurrent", state.chargingCurrent)
	helper.Add("chargingPower", state.chargingPower)
	helper.Add("batteryLastTimestamp", state.batteryLastTimestamp)
	helper.Add("batteryLevel", state.batteryLevel)
	helper.Add("batteryTargetLevel", state.batteryTargetLevel)

	return helper.Build()
}

type TeslaStateData struct {
	Id                   string
	Mode                 TeslaMode
	LastUpdate           time.Time
	WallConnectorStatus  TeslaDeviceStatus
	CarStatus            TeslaDeviceStatus
	ChargingStatus       TeslaChargingStatus
	ChargingCurrent      int       // Actual current (A)
	ChargingPower        int       // Actual charger power (kW)
	BatteryLastTimestamp time.Time // Last time we could check battery level
	BatteryLevel         int       // Actual battery level (%)
	BatteryTargetLevel   int       // Target battery level (%)
}

func NewTeslaState(data *TeslaStateData) *TeslaState {
	return &TeslaState{
		id:                   data.Id,
		mode:                 data.Mode,
		lastUpdate:           data.LastUpdate,
		wallConnectorStatus:  data.WallConnectorStatus,
		carStatus:            data.CarStatus,
		chargingStatus:       data.ChargingStatus,
		chargingCurrent:      data.ChargingCurrent,
		chargingPower:        data.ChargingPower,
		batteryLastTimestamp: data.BatteryLastTimestamp,
		batteryLevel:         data.BatteryLevel,
		batteryTargetLevel:   data.BatteryTargetLevel,
	}
}

func UpdateTeslaState(old *TeslaState, updater func(data *TeslaStateData)) *TeslaState {
	data := &TeslaStateData{
		Id:                   old.Id(),
		Mode:                 old.Mode(),
		LastUpdate:           old.LastUpdate(),
		WallConnectorStatus:  old.WallConnectorStatus(),
		CarStatus:            old.CarStatus(),
		ChargingStatus:       old.ChargingStatus(),
		ChargingCurrent:      old.ChargingCurrent(),
		ChargingPower:        old.ChargingPower(),
		BatteryLastTimestamp: old.BatteryLastTimestamp(),
		BatteryLevel:         old.BatteryLevel(),
		BatteryTargetLevel:   old.BatteryTargetLevel(),
	}

	updater(data)

	return NewTeslaState(data)
}

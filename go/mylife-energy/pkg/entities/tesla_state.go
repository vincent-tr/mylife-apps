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
	TeslaChargingStatusNotPlugged
	TeslaChargingStatusNoPower  // mode smart only
	TeslaChargingStatusDisabled // mode off
)

type TeslaState struct {
	id               string
	mode             TeslaMode
	fastLimit        int64 // Fast mode charge limit (%)
	smartLimitLow    int64 // Smart mode charge low limit (%)
	smartLimitHigh   int64 // Smart mode charge high limit (%)
	smartFastCurrent int64 // Smart mode fast charge current (A)

	lastUpdate           time.Time
	wallConnectorStatus  TeslaDeviceStatus
	carStatus            TeslaDeviceStatus
	chargingStatus       TeslaChargingStatus
	chargingCurrent      int       // Actual current (A)
	chargingPower        int       // Actual charger power (kW)
	chargingTimeLeft     int       // Time left for full charge (Minutes)
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

func (state *TeslaState) FastLimit() int64 {
	return state.fastLimit
}

func (state *TeslaState) SmartLimitLow() int64 {
	return state.smartLimitLow
}

func (state *TeslaState) SmartLimitHigh() int64 {
	return state.smartLimitHigh
}

func (state *TeslaState) SmartFastCurrent() int64 {
	return state.smartFastCurrent
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

// Time left for full charge (Minutes)
func (state *TeslaState) ChargingTimeLeft() int {
	return state.chargingTimeLeft
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

	helper.Add("_entity", "tesla-state")
	helper.Add("_id", state.id)
	helper.Add("mode", state.mode)
	helper.Add("fastLimit", state.fastLimit)
	helper.Add("smartLimitLow", state.smartLimitLow)
	helper.Add("smartLimitHigh", state.smartLimitHigh)
	helper.Add("smartFastCurrent", state.smartFastCurrent)
	helper.Add("lastUpdate", state.lastUpdate)
	helper.Add("wallConnectorStatus", state.wallConnectorStatus)
	helper.Add("carStatus", state.carStatus)
	helper.Add("chargingStatus", state.chargingStatus)
	helper.Add("chargingCurrent", state.chargingCurrent)
	helper.Add("chargingPower", state.chargingPower)
	helper.Add("chargingTimeLeft", state.chargingTimeLeft)
	helper.Add("batteryLastTimestamp", state.batteryLastTimestamp)
	helper.Add("batteryLevel", state.batteryLevel)
	helper.Add("batteryTargetLevel", state.batteryTargetLevel)

	return helper.Build()
}

type TeslaStateData struct {
	Id                   string
	Mode                 TeslaMode // Current charging mode
	FastLimit            int64     // Fast mode charge limit (%)
	SmartLimitLow        int64     // Smart mode charge low limit (%)
	SmartLimitHigh       int64     // Smart mode charge high limit (%)
	SmartFastCurrent     int64     // Smart mode fast charge current (A)
	LastUpdate           time.Time
	WallConnectorStatus  TeslaDeviceStatus
	CarStatus            TeslaDeviceStatus
	ChargingStatus       TeslaChargingStatus
	ChargingCurrent      int       // Actual current (A)
	ChargingPower        int       // Actual charger power (kW)
	ChargingTimeLeft     int       // Time left for full charge (Minutes)
	BatteryLastTimestamp time.Time // Last time we could check battery level
	BatteryLevel         int       // Actual battery level (%)
	BatteryTargetLevel   int       // Target battery level (%)
}

func NewTeslaState(data *TeslaStateData) *TeslaState {
	return &TeslaState{
		id:                   data.Id,
		mode:                 data.Mode,
		fastLimit:            data.FastLimit,
		smartLimitLow:        data.SmartLimitLow,
		smartLimitHigh:       data.SmartLimitHigh,
		smartFastCurrent:     data.SmartFastCurrent,
		lastUpdate:           data.LastUpdate,
		wallConnectorStatus:  data.WallConnectorStatus,
		carStatus:            data.CarStatus,
		chargingStatus:       data.ChargingStatus,
		chargingCurrent:      data.ChargingCurrent,
		chargingPower:        data.ChargingPower,
		chargingTimeLeft:     data.ChargingTimeLeft,
		batteryLastTimestamp: data.BatteryLastTimestamp,
		batteryLevel:         data.BatteryLevel,
		batteryTargetLevel:   data.BatteryTargetLevel,
	}
}

func UpdateTeslaState(old *TeslaState, updater func(data *TeslaStateData)) *TeslaState {
	data := &TeslaStateData{
		Id:                   old.Id(),
		Mode:                 old.Mode(),
		FastLimit:            old.FastLimit(),
		SmartLimitLow:        old.SmartLimitLow(),
		SmartLimitHigh:       old.SmartLimitHigh(),
		SmartFastCurrent:     old.SmartFastCurrent(),
		LastUpdate:           old.LastUpdate(),
		WallConnectorStatus:  old.WallConnectorStatus(),
		CarStatus:            old.CarStatus(),
		ChargingStatus:       old.ChargingStatus(),
		ChargingCurrent:      old.ChargingCurrent(),
		ChargingPower:        old.ChargingPower(),
		ChargingTimeLeft:     old.ChargingTimeLeft(),
		BatteryLastTimestamp: old.BatteryLastTimestamp(),
		BatteryLevel:         old.BatteryLevel(),
		BatteryTargetLevel:   old.BatteryTargetLevel(),
	}

	updater(data)

	return NewTeslaState(data)
}

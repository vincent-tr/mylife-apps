package entities

import (
	"mylife-tools/services/io/serialization"
	"time"
)

type UpsmonStatusFlag uint64

// https://fossies.org/linux/apcupsd/include/defines.h

const (

	// bit values for APC UPS Status Byte (ups->Status)

	UpsmonStatusCalibration = 0x00000001
	UpsmonStatusTrim        = 0x00000002
	UpsmonStatusBoost       = 0x00000004
	UpsmonStatusOnline      = 0x00000008
	UpsmonStatusOnbatt      = 0x00000010
	UpsmonStatusOverload    = 0x00000020
	UpsmonStatusBattlow     = 0x00000040
	UpsmonStatusReplacebatt = 0x00000080

	// Extended bit values added by apcupsd

	// Communications with UPS lost
	UpsmonStatusCommlost = 0x00000100
	// Shutdown in progress
	UpsmonStatusShutdown = 0x00000200
	// Set if this is a slave
	UpsmonStatusSlave = 0x00000400
	// Slave not responding
	UpsmonStatusSlavedown = 0x00000800
	// Set when UPS_ONBATT message is sent
	UpsmonStatusOnbatt_msg = 0x00020000
	// Set on power failure to poll faster
	UpsmonStatusFastpoll = 0x00040000
	// Set when BatLoad <= percent
	UpsmonStatusShutLoad = 0x00080000
	// Set when time on batts > maxtime
	UpsmonStatusShutBtime = 0x00100000
	// Set when TimeLeft <= runtime
	UpsmonStatusShutLtime = 0x00200000
	// Set when battery power has failed
	UpsmonStatusShutEmerg = 0x00400000
	// Set when remote shutdown
	UpsmonStatusShutRemote = 0x00800000
	// Set if computer is plugged into UPS
	UpsmonStatusPlugged = 0x01000000
	// Indicates if battery is connected
	UpsmonStatusBattpresent = 0x04000000
)

type UpsmonStatus struct {
	id                      string
	date                    time.Time
	upsName                 string
	startTime               time.Time
	model                   string
	status                  string
	statusFlag              UpsmonStatusFlag
	lineVoltage             float64
	loadPercent             float64
	batteryChargePercent    float64
	timeLeft                uint64
	batteryVoltage          float64
	lastTransfer            string
	numberTransfers         int
	xOnBattery              time.Time
	timeOnBattery           uint64
	cumulativeTimeOnBattery uint64
	xOffBattery             time.Time
	nominalInputVoltage     float64
	nominalBatteryVoltage   float64
	nominalPower            int
	firmware                string
	outputVoltage           float64
}

func (status *UpsmonStatus) Id() string {
	return status.id
}

// The date and time that the information was last obtained from the UPS.
func (status *UpsmonStatus) Date() time.Time {
	return status.date
}

// The name of the UPS as stored in the EEPROM or in the UPSNAME directive in the configuration file.
func (status *UpsmonStatus) UPSName() string {
	return status.upsName
}

// The time/date that apcupsd was started.
func (status *UpsmonStatus) StartTime() time.Time {
	return status.startTime
}

// The UPS model as derived from information from the UPS.
func (status *UpsmonStatus) Model() string {
	return status.model
}

// The current status of the UPS (ONLINE, ONBATT, etc.)
func (status *UpsmonStatus) Status() string {
	return status.status
}

// The current status of the UPS
func (status *UpsmonStatus) StatusFlag() UpsmonStatusFlag {
	return status.statusFlag
}

// The current line voltage as returned by the UPS.
func (status *UpsmonStatus) LineVoltage() float64 {
	return status.lineVoltage
}

// The percentage of load capacity as estimated by the UPS.
func (status *UpsmonStatus) LoadPercent() float64 {
	return status.loadPercent
}

// The percentage charge on the batteries.
func (status *UpsmonStatus) BatteryChargePercent() float64 {
	return status.batteryChargePercent
}

// The remaining runtime left on batteries as estimated by the UPS. (seconds)
func (status *UpsmonStatus) TimeLeft() uint64 {
	return status.timeLeft
}

// Battery voltage as supplied by the UPS.
func (status *UpsmonStatus) BatteryVoltage() float64 {
	return status.batteryVoltage
}

// The reason for the last transfer to batteries.
func (status *UpsmonStatus) LastTransfer() string {
	return status.lastTransfer
}

// The number of transfers to batteries since apcupsd startup.
func (status *UpsmonStatus) NumberTransfers() int {
	return status.numberTransfers
}

// Time and date of last transfer to batteries, or N/A.
func (status *UpsmonStatus) XOnBattery() time.Time {
	return status.xOnBattery
}

// Time in seconds currently on batteries, or 0. (seconds)
func (status *UpsmonStatus) TimeOnBattery() uint64 {
	return status.timeOnBattery
}

// Total (cumulative) time on batteries in seconds since apcupsd startup. (seconds)
func (status *UpsmonStatus) CumulativeTimeOnBattery() uint64 {
	return status.cumulativeTimeOnBattery
}

// Time and date of last transfer from batteries, or N/A.
func (status *UpsmonStatus) XOffBattery() time.Time {
	return status.xOffBattery
}

// The input voltage that the UPS is configured to expect.
func (status *UpsmonStatus) NominalInputVoltage() float64 {
	return status.nominalInputVoltage
}

// The nominal battery voltage.
func (status *UpsmonStatus) NominalBatteryVoltage() float64 {
	return status.nominalBatteryVoltage
}

// The maximum power in Watts that the UPS is designed to supply.
func (status *UpsmonStatus) NominalPower() int {
	return status.nominalPower
}

// The firmware revision number as reported by the UPS.
func (status *UpsmonStatus) Firmware() string {
	return status.firmware
}

// The current output voltage as returned by the UPS.
func (status *UpsmonStatus) OutputVoltage() float64 {
	return status.outputVoltage
}

func (status *UpsmonStatus) Marshal() (interface{}, error) {
	helper := serialization.NewStructMarshallerHelper()

	helper.Add("_entity", "upsmon-status")
	helper.Add("_id", status.id)
	helper.Add("date", status.date)
	helper.Add("upsName", status.upsName)
	helper.Add("startTime", status.startTime)
	helper.Add("model", status.model)
	helper.Add("status", status.status)
	helper.Add("statusFlag", status.statusFlag)
	helper.Add("lineVoltage", status.lineVoltage)
	helper.Add("loadPercent", status.loadPercent)
	helper.Add("batteryChargePercent", status.batteryChargePercent)
	helper.Add("timeLeft", status.timeLeft)
	helper.Add("batteryVoltage", status.batteryVoltage)
	helper.Add("lastTransfer", status.lastTransfer)
	helper.Add("numberTransfers", status.numberTransfers)
	helper.Add("xOnBattery", status.xOnBattery)
	helper.Add("timeOnBattery", status.timeOnBattery)
	helper.Add("cumulativeTimeOnBattery", status.cumulativeTimeOnBattery)
	helper.Add("xOffBattery", status.xOffBattery)
	helper.Add("nominalInputVoltage", status.nominalInputVoltage)
	helper.Add("nominalBatteryVoltage", status.nominalBatteryVoltage)
	helper.Add("nominalPower", status.nominalPower)
	helper.Add("firmware", status.firmware)
	helper.Add("outputVoltage", status.outputVoltage)

	return helper.Build()
}

type UpsmonStatusValues struct {
	Id                      string
	Date                    time.Time
	UPSName                 string
	StartTime               time.Time
	Model                   string
	Status                  string
	StatusFlag              UpsmonStatusFlag
	LineVoltage             float64
	LoadPercent             float64
	BatteryChargePercent    float64
	TimeLeft                time.Duration
	BatteryVoltage          float64
	LastTransfer            string
	NumberTransfers         int
	XOnBattery              time.Time
	TimeOnBattery           time.Duration
	CumulativeTimeOnBattery time.Duration
	XOffBattery             time.Time
	NominalInputVoltage     float64
	NominalBatteryVoltage   float64
	NominalPower            int
	Firmware                string
	OutputVoltage           float64
}

func NewUpsmonStatus(values *UpsmonStatusValues) *UpsmonStatus {
	return &UpsmonStatus{
		id:                      values.Id,
		date:                    values.Date,
		upsName:                 values.UPSName,
		startTime:               values.StartTime,
		model:                   values.Model,
		status:                  values.Status,
		statusFlag:              values.StatusFlag,
		lineVoltage:             values.LineVoltage,
		loadPercent:             values.LoadPercent,
		batteryChargePercent:    values.BatteryChargePercent,
		timeLeft:                uint64(values.TimeLeft.Seconds()),
		batteryVoltage:          values.BatteryVoltage,
		lastTransfer:            values.LastTransfer,
		numberTransfers:         values.NumberTransfers,
		xOnBattery:              values.XOnBattery,
		timeOnBattery:           uint64(values.TimeOnBattery.Seconds()),
		cumulativeTimeOnBattery: uint64(values.CumulativeTimeOnBattery.Seconds()),
		xOffBattery:             values.XOffBattery,
		nominalInputVoltage:     values.NominalInputVoltage,
		nominalBatteryVoltage:   values.NominalBatteryVoltage,
		nominalPower:            values.NominalPower,
		firmware:                values.Firmware,
		outputVoltage:           values.OutputVoltage,
	}
}

func UpsmonStatusesEqual(a *UpsmonStatus, b *UpsmonStatus) bool {
	return a.id == b.id &&
		a.date == b.date &&
		a.upsName == b.upsName &&
		a.startTime == b.startTime &&
		a.model == b.model &&
		a.status == b.status &&
		a.statusFlag == b.statusFlag &&
		a.lineVoltage == b.lineVoltage &&
		a.loadPercent == b.loadPercent &&
		a.batteryChargePercent == b.batteryChargePercent &&
		a.timeLeft == b.timeLeft &&
		a.batteryVoltage == b.batteryVoltage &&
		a.lastTransfer == b.lastTransfer &&
		a.numberTransfers == b.numberTransfers &&
		a.xOnBattery == b.xOnBattery &&
		a.timeOnBattery == b.timeOnBattery &&
		a.cumulativeTimeOnBattery == b.cumulativeTimeOnBattery &&
		a.xOffBattery == b.xOffBattery &&
		a.nominalInputVoltage == b.nominalInputVoltage &&
		a.nominalBatteryVoltage == b.nominalBatteryVoltage &&
		a.nominalPower == b.nominalPower &&
		a.firmware == b.firmware &&
		a.outputVoltage == b.outputVoltage
}

package wall_connector

type vitals struct {
	ContactorClosed   bool     `json:"contactor_closed"`    // Is the contector closed
	VehicleConnected  bool     `json:"vehicle_connected"`   // Is the vehicle connected
	SessionS          uint64   `json:"session_s"`           // Current session time in seconds
	GridV             float64  `json:"grid_v"`              // Measured grid voltage
	GridHz            float64  `json:"grid_hz"`             // Measured grid frequency
	VehicleCurrentA   float64  `json:"vehicle_current_a"`   // Measured vehicle current
	CurrentAA         float64  `json:"currentA_a"`          // Measured current on phase A
	CurrentBA         float64  `json:"currentB_a"`          // Measured current on phase B
	CurrentCA         float64  `json:"currentC_a"`          // Measured current on phase C
	CurrentNA         float64  `json:"currentN_a"`          // Measured current on neutral
	VoltageAV         float64  `json:"voltageA_v"`          // Measured voltage on phase A
	VoltageBV         float64  `json:"voltageB_v"`          // Measured voltage on phase B
	VoltageCV         float64  `json:"voltageC_v"`          // Measured voltage on phase C
	RelayCoilV        float64  `json:"relay_coil_v"`        // Relay coil voltage
	PcbaTempC         float64  `json:"pcba_temp_c"`         // PCBA temperature
	HandleTempC       float64  `json:"handle_temp_c"`       // Handle Temperature
	McuTempC          float64  `json:"mcu_temp_c"`          // MCU Temperature
	UptimeS           uint64   `json:"uptime_s"`            // Uptime in seconds
	InputThermopileUv int64    `json:"input_thermopile_uv"` // Input thermopile UV
	ProxV             float64  `json:"prox_v"`              // PROX V
	PilotHighV        float64  `json:"pilot_high_v"`        // Pilot signal high voltage
	PilotLowV         float64  `json:"pilot_low_v"`         // Pilot signal low voltage
	SessionEnergyWh   float64  `json:"session_energy_wh"`   // Amount of energy delivered by the wall connector during this session
	ConfigStatus      int      `json:"config_status"`       // Config status
	EvseState         int      `json:"evse_state"`          // State of the Wall Connector
	CurrentAlerts     []string `json:"current_alerts"`      // Current alerts
}

type lifetime struct {
	ContactorCycles       uint64  `json:"contactor_cycles"`        /// Contactor cycles
	ContactorCyclesLoaded uint64  `json:"contactor_cycles_loaded"` /// Contactor cycles Loaded
	AlertCount            uint64  `json:"alert_count"`             /// Alert Count
	ThermalFoldbacks      uint64  `json:"thermal_foldbacks"`       /// Thermal foldbacks
	AvgStartupTemp        float64 `json:"avg_startup_temp"`        /// Average startup Temperature
	ChargeStarts          uint64  `json:"charge_starts"`           /// Number of started charges
	EnergyWh              uint64  `json:"energy_wh"`               /// Total energy delivered in Wh
	ConnectorCycles       uint64  `json:"connector_cycles"`        /// Connector cycles
	UptimeS               uint64  `json:"uptime_s"`                /// Uptime in seconds
	ChargingTimeS         uint64  `json:"charging_time_s"`         /// Total Charging time in seconds
}

type version struct {
	FirmwareVersion string `json:"firmware_version"` /// Firmware version
	PartNumber      string `json:"part_number"`      /// Part number
	SerialNumber    string `json:"serial_number"`    /// Serial Number
}

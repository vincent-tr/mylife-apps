package monitor

import (
	"encoding/json"
)

type nagiosReturnCode int

const (
	nagiosOK       nagiosReturnCode = 0
	nagiosWarning  nagiosReturnCode = 1
	nagiosCritical nagiosReturnCode = 2
	nagiosUnknown  nagiosReturnCode = 3
)

func (code nagiosReturnCode) String() string {
	switch code {
	case nagiosOK:
		return "OK"
	case nagiosWarning:
		return "WARNING"
	case nagiosCritical:
		return "CRITICAL"
	default:
		return "UNKNOWN"
	}
}

type nagiosReport struct {
	Code   nagiosReturnCode `json:"code"`
	Output string           `json:"output"`
}

func buildNagiosReport(probes map[ProbeStatus][]probe) ([]byte, string, error) {
	report := &nagiosReport{
		Code: nagiosOK,
	}

	output := ""

	for _, status := range []ProbeStatus{ProbeStatusCritical, ProbeStatusWarning, ProbeStatusOK} {
		list := probes[status]
		if list == nil {
			continue
		}

		if report.Code == nagiosOK {
			report.Code = statusToNagios(status)
		}

		for _, probe := range list {
			if output != "" {
				output += ", "
			}

			output += probe.name + " " + string(probe.status)
			if probe.message != "" {
				output += ": " + probe.message
			}
		}
	}

	report.Output = report.Code.String()
	if output != "" {
		report.Output += ": " + output
	}

	data, err := json.Marshal(report)
	if err != nil {
		return nil, "", err
	}

	contentType := "application/json"
	return data, contentType, nil
}

func statusToNagios(status ProbeStatus) nagiosReturnCode {
	switch status {
	case ProbeStatusOK:
		return nagiosOK
	case ProbeStatusWarning:
		return nagiosWarning
	case ProbeStatusCritical:
		return nagiosCritical
	default:
		return nagiosUnknown
	}
}

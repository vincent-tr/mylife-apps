package images

import (
	"fmt"
	"regexp"
	"strconv"
	"strings"
	"time"
)

var (
	// durationRegex matches single number+unit duration strings
	durationRegex = regexp.MustCompile(`^(\d+(?:\.\d+)?)(s|m|h|d|w)$`)

	// units maps unit strings to their duration in seconds
	units = map[string]time.Duration{
		"s": time.Second,        // second
		"m": time.Minute,        // minute = 60 seconds
		"h": time.Hour,          // hour = 3600 seconds
		"d": 24 * time.Hour,     // day = 24 hours
		"w": 7 * 24 * time.Hour, // week = 7 days
	}
)

// parseDuration parses a simple duration string with a single number and unit.
// Supported units:
//   - "s" for seconds
//   - "m" for minutes
//   - "h" for hours
//   - "d" for days (24 hours)
//   - "w" for weeks (7 days)
//
// Examples:
//   - "30s" -> 30 seconds
//   - "5m" -> 5 minutes
//   - "4h" -> 4 hours
//   - "1d" -> 24 hours
//   - "2w" -> 14 days
func parseDuration(s string) (time.Duration, error) {
	if s == "" {
		return 0, fmt.Errorf("empty duration string")
	}

	s = strings.TrimSpace(s)

	matches := durationRegex.FindStringSubmatch(s)
	if matches == nil {
		return 0, fmt.Errorf("invalid duration format: %q (expected format: number + unit, e.g. '4h')", s)
	}

	valueStr := matches[1]
	unit := matches[2]

	// Parse the numeric value
	value, err := strconv.ParseFloat(valueStr, 64)
	if err != nil {
		return 0, fmt.Errorf("invalid duration value %q: %v", valueStr, err)
	}

	if value < 0 {
		return 0, fmt.Errorf("duration cannot be negative: %q", s)
	}

	// Get the unit duration
	unitDuration, exists := units[unit]
	if !exists {
		return 0, fmt.Errorf("unsupported unit %q (supported: s, m, h, d, w)", unit)
	}

	return time.Duration(float64(unitDuration) * value), nil
}

// formatDuration formats a duration using the most appropriate unit for readability.
// It chooses the largest unit that results in a whole number when possible.
func formatDuration(d time.Duration) string {
	if d == 0 {
		return "0s"
	}

	// Try units from largest to smallest
	for _, unitInfo := range []struct {
		suffix   string
		duration time.Duration
	}{
		{"w", 7 * 24 * time.Hour},
		{"d", 24 * time.Hour},
		{"h", time.Hour},
		{"m", time.Minute},
		{"s", time.Second},
	} {
		if d%unitInfo.duration == 0 {
			value := d / unitInfo.duration
			return fmt.Sprintf("%d%s", value, unitInfo.suffix)
		}
	}

	// Fallback: use seconds with decimal if needed
	seconds := float64(d) / float64(time.Second)
	if seconds == float64(int64(seconds)) {
		return fmt.Sprintf("%ds", int64(seconds))
	}
	return fmt.Sprintf("%.1fs", seconds)
}

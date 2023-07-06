package api

import (
	"fmt"
	"strconv"
	"strings"
)

type Position struct {
	lat  float64
	long float64
}

func ParsePosition(pos string) (Position, error) {

	parts := strings.Split(pos, " ")
	if len(parts) != 2 {
		return Position{}, fmt.Errorf("Invalid position '%s' (split fails)", pos)
	}

	latitude, err := strconv.ParseFloat(parts[0], 64)
	if err != nil {
		return Position{}, fmt.Errorf("Invalid position '%s' (parse lat) : %w", pos, err)
	}

	longitude, err := strconv.ParseFloat(parts[1], 64)
	if err != nil {
		return Position{}, fmt.Errorf("Invalid position '%s' (parse long) : %w", pos, err)
	}

	return Position{lat: latitude, long: longitude}, nil
}

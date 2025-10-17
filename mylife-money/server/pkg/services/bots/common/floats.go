package common

import "math"

func AmountsEqual(a, b float64) bool {
	const epsilon = 0.01 // below one cent difference is considered equal
	return math.Abs(a-b) < epsilon
}

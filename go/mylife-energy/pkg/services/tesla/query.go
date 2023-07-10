package tesla

import (
	"context"
	"mylife-energy/pkg/entities"
	"mylife-energy/pkg/services/query"
	"time"

	"golang.org/x/exp/slices"
)

type mainMeasure struct {
	timestamp     time.Time
	apparentPower float64
	current       float64
}

func queryPower(ctx context.Context) ([]*mainMeasure, error) {
	// Query last minute of Linky, current + apparent power so that we can trigger negative values
	filter := query.And(
		query.Gte("timestamp", time.Now().Add(-time.Minute)),
		query.In("sensor.sensorId", "epanel-linky-current", "epanel-linky-apparent-power", "epanel-ct-voltage"),
	)

	results, err := query.Find(ctx, filter.Build())

	if err != nil {
		return nil, err
	}

	// match power with current, consider it's same order
	powerMeasures := make([]*entities.Measure, 0)
	currentMeasures := make([]*entities.Measure, 0)
	voltageMeasures := make([]*entities.Measure, 0)

	for _, res := range results {
		switch res.Measure.Sensor() {
		case "epanel-linky-current":
			currentMeasures = append(currentMeasures, res.Measure)
		case "epanel-linky-apparent-power":
			powerMeasures = append(powerMeasures, res.Measure)
		case "epanel-ct-voltage":
			voltageMeasures = append(voltageMeasures, res.Measure)
		}
	}

	slices.SortFunc(powerMeasures, measureTimestampComparer)
	slices.SortFunc(currentMeasures, measureTimestampComparer)
	slices.SortFunc(voltageMeasures, measureTimestampComparer)

	measures := make([]*mainMeasure, 0)

	// take one list and binary search item (time diff 3sec) from the others
	for _, powerMeasure := range powerMeasures {
		currentMeasureIndex, found := slices.BinarySearchFunc(currentMeasures, powerMeasure.Timestamp(), findClosestComparer)
		if !found {
			continue
		}

		voltageMeasureIndex, found := slices.BinarySearchFunc(voltageMeasures, powerMeasure.Timestamp(), findClosestComparer)
		if !found {
			continue
		}

		currentMeasure := currentMeasures[currentMeasureIndex]
		voltageMeasure := voltageMeasures[voltageMeasureIndex]

		measure := &mainMeasure{
			timestamp:     timestampMiddle(powerMeasure.Timestamp(), currentMeasure.Timestamp()),
			apparentPower: powerMeasure.Value(),
			current:       currentMeasure.Value(),
		}

		// Ajust linky measures : if apparent-power = 0 && current > 0 then it is exported, let's make it negative

		if measure.apparentPower == 0 && measure.current > 0 {
			measure.current = -measure.current
			measure.apparentPower = measure.current * voltageMeasure.Value()
		}

		measures = append(measures, measure)
	}

	return measures, nil
}

func measureTimestampComparer(a, b *entities.Measure) bool {
	return a.Timestamp().Before(b.Timestamp())
}

func findClosestComparer(measure *entities.Measure, timestamp time.Time) int {
	diff := measure.Timestamp().Sub(timestamp)
	if diff.Abs() < time.Second*3 {
		return 0
	} else if diff.Seconds() < 0 {
		return -1
	} else {
		return 1
	}
}

func timestampMiddle(a, b time.Time) time.Time {
	diff := a.Sub(b)
	half := time.Nanosecond * time.Duration(diff.Nanoseconds()/2)
	return a.Add(half)
}

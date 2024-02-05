package live_query

import (
	"context"
	"mylife-energy/pkg/entities"
	"mylife-energy/pkg/services/query"
	"time"

	"golang.org/x/exp/slices"
)

type Measure struct {
	Timestamp     time.Time
	ApparentPower float64
	Current       float64
}

func QueryMainPower(ctx context.Context) ([]*Measure, error) {
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

	measures := make([]*Measure, 0)

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

		measure := &Measure{
			Timestamp:     timestampMiddle(powerMeasure.Timestamp(), currentMeasure.Timestamp()),
			ApparentPower: powerMeasure.Value(),
			Current:       currentMeasure.Value(),
		}

		// Ajust linky measures : if apparent-power = 0 && current > 0 then it is exported, let's make it negative

		if measure.ApparentPower == 0 && measure.Current > 0 {
			measure.Current = -measure.Current
			measure.ApparentPower = measure.Current * voltageMeasure.Value()
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
	if diff.Abs() < time.Second*5 {
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

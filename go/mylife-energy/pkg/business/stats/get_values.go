package stats

import (
	"context"
	"fmt"
	"mylife-energy/pkg/entities"
	"mylife-energy/pkg/services/query"
	"time"
)

// jour -> toutes les 15 mins
// mois -> tous les jours
// annee -> tous les mois

type StatsType uint

const (
	Day StatsType = iota + 1
	Month
	Year
)

type StatValues struct {
	Sensor   *entities.Sensor
	Measures []entities.Measure
}

type mongoAggregatedMeasure struct {
	Id    time.Time `bson:"_id"`
	Count uint64    `bson:"count"`
	Value float64   `bson:"value"`
}

func GetValues(typ StatsType, timestamp time.Time, sensors []string) ([]StatValues, error) {
	// Note: must be quick because we are on eventloop

	beginDate, endDate, groupId := configureOptions(typ, timestamp)
	stats := make([]StatValues, 0, len(sensors))

	for _, sensor := range sensors {
		stat, err := getStatValues(beginDate, endDate, groupId, sensor)
		if err != nil {
			return nil, err
		}

		stats = append(stats, *stat)
	}

	return stats, nil
}

func configureOptions(typ StatsType, timestamp time.Time) (beginDate time.Time, endDate time.Time, groupId any) {

	switch typ {
	case Day:
		beginDate = time.Date(timestamp.Year(), timestamp.Month(), timestamp.Day(), 0, 0, 0, 0, time.Local)
		endDate = beginDate.AddDate(0, 0, 1)

		groupId = query.ToDate(
			query.Substract(
				query.ToLong("$timestamp"),
				query.Mod(query.ToLong("$timestamp"), 1000*60*15),
			),
		)

	case Month:
		beginDate = time.Date(timestamp.Year(), timestamp.Month(), 1, 0, 0, 0, 0, time.Local)
		endDate = beginDate.AddDate(0, 1, 0)

		groupId = query.DateFromParts(
			query.DatePart{Name: "year", Expression: query.Year("$timestamp")},
			query.DatePart{Name: "month", Expression: query.Month("$timestamp")},
			query.DatePart{Name: "day", Expression: query.Day("$timestamp")},
		)

	case Year:
		beginDate = time.Date(timestamp.Year(), 1, 1, 0, 0, 0, 0, time.Local)
		endDate = beginDate.AddDate(1, 0, 0)

		groupId = query.DateFromParts(
			query.DatePart{Name: "year", Expression: query.Year("$timestamp")},
			query.DatePart{Name: "month", Expression: query.Month("$timestamp")},
		)
	}

	return
}

func getStatValues(beginDate time.Time, endDate time.Time, groupId any, sensor string) (*StatValues, error) {
	builder := query.NewPipelineBuilder().
		Match(
			query.And(
				query.Eq("sensor.sensorId", sensor+"-real-power"),
				query.Gte("timestamp", beginDate),
				query.Lt("timestamp", endDate),
			),
		).
		Group(
			groupId,
			query.GroupField{Name: "count", Accumulator: "$sum", Expression: 1},
			query.GroupField{Name: "value", Accumulator: "$sum", Expression: query.Divide("$value", 360)},
		)

	results, err := query.AggregateRaw[mongoAggregatedMeasure](context.TODO(), builder.Build())

	if err != nil {
		return nil, err
	}

	stat := &StatValues{
		Sensor: entities.NewSensor(&entities.SensorData{
			Id:                sensor,
			DeviceClass:       "energy", // "power"?
			StateClass:        "none",
			UnitOfMeasurement: "Wh",
			AccuracyDecimals:  0,
		}),
		Measures: make([]entities.Measure, 0, len(results)),
	}

	// TODO: handle down time with "count"

	for _, item := range results {
		stat.Measures = append(stat.Measures, *entities.NewMeasure(&entities.MeasureData{
			Id:        fmt.Sprintf("%d", item.Id.Unix()),
			Sensor:    stat.Sensor.Id(),
			Timestamp: item.Id,
			Value:     item.Value,
		}))
	}

	return stat, nil
}

package tesla

import (
	"context"
	"mylife-energy/pkg/services/query"
	"mylife-tools-server/utils"
	"time"
)

type chargeEngine struct {
	worker       *utils.Worker
	ctx          context.Context
	ctxTerminate context.CancelFunc
}

func makeChargeEngine() *chargeEngine {
	e := &chargeEngine{}

	e.ctx, e.ctxTerminate = context.WithCancel(context.Background())

	e.worker = utils.NewInterval(time.Minute/10, e.intervalEntry)

	return e
}

func (e *chargeEngine) terminate() {
	e.ctxTerminate()
	e.worker.Terminate()
}

func (e *chargeEngine) intervalEntry() {

	// Query last minute of Linky, current + apparent power so that we can trigger negative values
	filter := query.And(
		query.Gte("timestamp", time.Now().Add(-time.Minute)),
		query.In("sensor.sensorId", "epanel-linky-current", "epanel-linky-apparent-power"),
	)

	results, err := query.Find(e.ctx, filter.Build())

	if err != nil {
		logger.WithError(err).Error("Error querying results")
		return
	}

	for _, res := range results {
		logger.Debugf("%s %s %f\n", res.Measure.Sensor(), res.Measure.Timestamp().String(), res.Measure.Value())
	}
}

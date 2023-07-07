package tesla

import (
	"context"
	"mylife-energy/pkg/entities"
	"mylife-energy/pkg/services/tesla/api"
	"mylife-energy/pkg/services/tesla/wall_connector"
	"mylife-tools-server/services/tasks"
	"mylife-tools-server/utils"
	"strings"
	"time"
)

type stateUpdate[T any] struct {
	Timestamp time.Time
	Status    entities.TeslaDeviceStatus
	LastState *T // If online = true should have same timestamp else should be older
}

type stateData struct {
	Car           stateUpdate[api.ChargeData]
	WallConnector stateUpdate[wall_connector.Data]
}

type stateManager struct {
	api              *api.Client
	wallConnector    *wall_connector.Client
	context          context.Context
	contextTerminate func()
	refreshWorker    *utils.Worker
	data             stateData // Only managed on event-loop
	updateCallback   func()    // Called on event-loop
}

func makeStateManager(tokenPath string, vin string, homeLocation api.Position, wcAddress string, updateCallback func()) (*stateManager, error) {
	sm := &stateManager{
		updateCallback: updateCallback,
	}

	sm.context, sm.contextTerminate = context.WithCancel(context.Background())

	var err error

	sm.api, err = api.MakeClient(sm.context, tokenPath, vin, homeLocation)
	if err != nil {
		return nil, err
	}

	sm.wallConnector = wall_connector.MakeClient(sm.context, wcAddress)

	sm.refreshWorker = utils.NewInterval(10*time.Second, sm.refresh)

	return sm, nil
}

func (sm *stateManager) terminate() {
	sm.contextTerminate()
	sm.refreshWorker.Terminate()

	sm.api = nil
	sm.wallConnector = nil
}

func (sm *stateManager) refresh() {
	carData, carErr := sm.api.FetchChargeData()
	wcData, wcErr := sm.wallConnector.FetchData()

	tasks.SubmitEventLoop("tesla/state-update", func() {
		sm.refreshCar(carData, carErr)
		sm.refreshWC(wcData, wcErr)
		sm.updateCallback()
	})
}

func (sm *stateManager) refreshCar(fetchedData *api.ChargeData, err error) {
	data := &sm.data.Car

	data.Timestamp = time.Now()

	if err == nil {
		data.Status = entities.TeslaDeviceStatusOnline
		data.LastState = fetchedData
		return
	}

	if strings.Contains(err.Error(), "408") {
		// Car is sleeping
		data.Status = entities.TeslaDeviceStatusOffline
		return
	}

	logger.WithError(err).Error("Could not api.FetchChargeData")
	data.Status = entities.TeslaDeviceStatusFailure
}

func (sm *stateManager) refreshWC(fetchedData *wall_connector.Data, err error) {
	data := &sm.data.WallConnector

	data.Timestamp = time.Now()

	if err == nil {
		data.Status = entities.TeslaDeviceStatusOnline
		data.LastState = fetchedData
		return
	}

	logger.WithError(err).Error("Could not wallConnector.FetchData")
	data.Status = entities.TeslaDeviceStatusFailure
}

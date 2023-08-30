package upsmon

import (
	"context"
	"mylife-monitor/pkg/entities"
	"mylife-tools-server/config"
	"mylife-tools-server/log"
	"mylife-tools-server/services"
	"mylife-tools-server/services/store"
	"mylife-tools-server/services/tasks"
	"mylife-tools-server/utils"
	"strconv"
	"strings"
	"time"

	"github.com/mdlayher/apcupsd"
)

var logger = log.CreateLogger("mylife:monitor:upsmon")

type upsmonConfig struct {
	Addresses []string `mapstructure:"addresses"`
	Interval  int      `mapstructure:"interval"`
}

type upsmonService struct {
	context          context.Context
	contextTerminate func()
	refreshWorker    *utils.Worker
	addresses        []string
	dataView         *store.Container[*entities.UpsmonStatus]
	summaryView      *store.Container[*entities.UpsmonSummary]
}

func (service *upsmonService) Init(arg interface{}) error {
	conf := upsmonConfig{}
	config.BindStructure("upsmon", &conf)

	service.context, service.contextTerminate = context.WithCancel(context.Background())
	service.addresses = conf.Addresses

	logger.WithFields(log.Fields{"addresses": conf.Addresses, "refreshInterval": conf.Interval}).Info("upsmon client configured")

	service.dataView = store.NewContainer[*entities.UpsmonStatus]("upsmon-data")
	service.summaryView = store.NewContainer[*entities.UpsmonSummary]("upsmon-summary")

	service.refreshWorker = utils.NewInterval(time.Duration(conf.Interval)*time.Second, service.refresh)

	return nil
}

func (service *upsmonService) Terminate() error {
	service.contextTerminate()
	service.refreshWorker.Terminate()

	return nil
}

func (service *upsmonService) ServiceName() string {
	return "upsmon"
}

func (service *upsmonService) Dependencies() []string {
	return []string{}
}

func (service *upsmonService) refresh() {
	statuses := make([]*apcupsd.Status, 0)

	for _, address := range service.addresses {
		status, err := readStatus(service.context, address)
		if err != nil {
			logger.WithError(err).Error("Error reading ups status")
			return
		}

		statuses = append(statuses, status)
	}

	data, summary, err := buildEntities(statuses)
	if err != nil {
		logger.WithError(err).Error("Error building entities")
		return
	}

	tasks.SubmitEventLoop("upsmon/state-update", func() {
		service.dataView.ReplaceAll(data, entities.UpsmonStatusesEqual)
		service.summaryView.ReplaceAll(summary, entities.UpsmonSummariesEqual)
	})
}

func init() {
	services.Register(&upsmonService{})
}

func readStatus(ctx context.Context, address string) (*apcupsd.Status, error) {
	client, err := apcupsd.DialContext(ctx, "tcp", address)
	if err != nil {
		return nil, err
	}

	defer client.Close()

	return client.Status()
}

func buildEntities(statuses []*apcupsd.Status) ([]*entities.UpsmonStatus, []*entities.UpsmonSummary, error) {
	data := make([]*entities.UpsmonStatus, 0)
	summary := make([]*entities.UpsmonSummary, 0)

	for _, status := range statuses {
		statusFlag, err := parseStatusFlag(status.StatusFlags)
		if err != nil {
			return nil, nil, err
		}

		statusValues := &entities.UpsmonStatusValues{
			Id:                      status.UPSName,
			Date:                    status.Date,
			UPSName:                 status.UPSName,
			StartTime:               status.StartTime,
			Model:                   status.Model,
			Status:                  status.Status,
			StatusFlag:              statusFlag,
			LineVoltage:             status.LineVoltage,
			LoadPercent:             status.LoadPercent,
			BatteryChargePercent:    status.BatteryChargePercent,
			TimeLeft:                status.TimeLeft,
			BatteryVoltage:          status.BatteryVoltage,
			LastTransfer:            status.LastTransfer,
			NumberTransfers:         status.NumberTransfers,
			XOnBattery:              status.XOnBattery,
			TimeOnBattery:           status.TimeOnBattery,
			CumulativeTimeOnBattery: status.CumulativeTimeOnBattery,
			XOffBattery:             status.XOffBattery,
			NominalInputVoltage:     status.NominalInputVoltage,
			NominalBatteryVoltage:   status.NominalBatteryVoltage,
			NominalPower:            status.NominalPower,
			Firmware:                status.Firmware,
			OutputVoltage:           status.OutputVoltage,
		}

		summaryValues := &entities.UpsmonSummaryValues{
			Id:      status.UPSName,
			Date:    status.Date,
			UPSName: status.UPSName,
			Status:  status.Status,
		}

		data = append(data, entities.NewUpsmonStatus(statusValues))
		summary = append(summary, entities.NewUpsmonSummary(summaryValues))
	}

	return data, summary, nil
}

func parseStatusFlag(value string) (entities.UpsmonStatusFlag, error) {
	strValue := strings.Replace(value, "0x", "", -1)
	intValue, err := strconv.ParseUint(strValue, 16, 64)
	if err != nil {
		var defaultValue entities.UpsmonStatusFlag
		return defaultValue, err
	}

	return entities.UpsmonStatusFlag(intValue), nil
}

func getService() *upsmonService {
	return services.GetService[*upsmonService]("upsmon")
}

// Public access

func GetDataView() store.IContainer[*entities.UpsmonStatus] {
	return getService().dataView
}

func GetSummaryView() store.IContainer[*entities.UpsmonSummary] {
	return getService().summaryView
}

package monitor

import (
	"mylife-tools-server/config"
	"mylife-tools-server/log"
	"mylife-tools-server/services"
	"net/http"
	"sync"
)

// https://nagios-plugins.org/doc/guidelines.html

var logger = log.CreateLogger("mylife:money:monitor")

type ProbeStatus string

const (
	ProbeStatusOK       ProbeStatus = "OK"
	ProbeStatusWarning  ProbeStatus = "WARNING"
	ProbeStatusCritical ProbeStatus = "CRITICAL"
)

type monitorConfig struct {
	Address string `mapstructure:"address"`
}

type probe struct {
	name    string
	status  ProbeStatus
	message string
}

type monitorService struct {
	probes     map[string]probe
	probesLock sync.RWMutex
	server     *http.Server
	exitDone   *sync.WaitGroup
}

func (service *monitorService) Init(arg interface{}) error {
	monitorConfig := monitorConfig{}
	config.BindStructure("monitor", &monitorConfig)

	service.probes = make(map[string]probe)

	service.exitDone = &sync.WaitGroup{}
	service.exitDone.Add(1)

	mux := http.NewServeMux()

	service.server = &http.Server{
		Addr:    monitorConfig.Address,
		Handler: mux,
	}

	mux.Handle("/", http.HandlerFunc(service.webHandler))

	go func() {
		defer service.exitDone.Done()

		// always returns error. ErrServerClosed on graceful close
		if err := service.server.ListenAndServe(); err != http.ErrServerClosed {
			logger.WithError(err).Error("ListenAndServe error")
		}
	}()

	logger.WithField("address", monitorConfig.Address).Info("Listening")

	return nil
}

func (service *monitorService) webHandler(w http.ResponseWriter, r *http.Request) {
	probes := service.prepareReport()
	body, contentType, err := buildNagiosReport(probes)
	if err != nil {
		logger.WithError(err).Error("buildNagiosReport error")
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", contentType)

	if _, err := w.Write(body); err != nil {
		logger.WithError(err).Error("Write error")
		return
	}
}

func (service *monitorService) prepareReport() map[ProbeStatus][]probe {
	service.probesLock.RLock()
	defer service.probesLock.RUnlock()

	probes := make(map[ProbeStatus][]probe)
	for _, probe := range service.probes {
		probes[probe.status] = append(probes[probe.status], probe)
	}
	return probes
}

func (service *monitorService) setProbeStatus(name string, status ProbeStatus, message string) {
	logger.WithFields(log.Fields{
		"probe":   name,
		"status":  status,
		"message": message,
	}).Info("Probe status")

	service.probesLock.Lock()
	defer service.probesLock.Unlock()

	service.probes[name] = probe{
		name:    name,
		status:  status,
		message: message,
	}
}

func (service *monitorService) Terminate() error {

	return nil
}

func (service *monitorService) ServiceName() string {
	return "monitor"
}

func (service *monitorService) Dependencies() []string {
	return []string{}
}

func init() {
	services.Register(&monitorService{})
}

func getService() *monitorService {
	return services.GetService[*monitorService]("monitor")
}

// Public access

func SetProbeStatus(name string, status ProbeStatus, message string) {
	getService().setProbeStatus(name, status, message)
}

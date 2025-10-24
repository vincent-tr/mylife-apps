package web

import (
	"context"
	"fmt"
	"io/fs"
	"mylife-tools-server/config"
	"mylife-tools-server/log"
	"mylife-tools-server/services"
	"net/http"
	"sync"

	"github.com/gorilla/mux"
)

var logger = log.CreateLogger("mylife:server:web")

func init() {
	services.Register(&webService{})
}

type webServerConfig struct {
	Address string `mapstructure:"address"`
	Target  string `mapstructure:"target"`
}

type webService struct {
	server   *http.Server
	exitDone *sync.WaitGroup
	mux      *mux.Router
}

// https://stackoverflow.com/questions/39320025/how-to-stop-http-listenandserve

func (service *webService) Init(arg interface{}) error {
	webServerConfig := webServerConfig{}
	config.BindStructure("webServer", &webServerConfig)

	service.exitDone = &sync.WaitGroup{}
	service.exitDone.Add(1)

	service.mux = mux.NewRouter()

	service.server = &http.Server{
		Addr:    webServerConfig.Address,
		Handler: service.mux,
	}

	if arg == nil {
		return fmt.Errorf("missing argument")
	}

	fs := arg.(fs.FS)

	proxyHandler, err := makeProxyHandler(webServerConfig.Target)
	if err != nil {
		return err
	}

	fileServerHandler, err := makeFileServerHandler(fs)
	if err != nil {
		return err
	}

	service.mux.HandleFunc("/api/random-image", imageHandler)
	service.mux.PathPrefix("/target").Handler(http.StripPrefix("/target", proxyHandler))
	service.mux.PathPrefix("/").Handler(fileServerHandler)

	go func() {
		defer service.exitDone.Done()

		// always returns error. ErrServerClosed on graceful close
		if err := service.server.ListenAndServe(); err != http.ErrServerClosed {
			logger.WithError(err).Error("ListenAndServe error")
		}
	}()

	logger.WithField("address", webServerConfig.Address).Info("Listening")

	return nil
}

func (service *webService) Terminate() error {
	if err := service.server.Shutdown(context.TODO()); err != nil {
		return err
	}

	service.exitDone.Wait()

	logger.Info("Stopped")

	return nil
}

func (service *webService) ServiceName() string {
	return "web"
}

func (service *webService) Dependencies() []string {
	return []string{"images"}
}

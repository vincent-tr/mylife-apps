package secrets

import (
	"fmt"
	"os"
	"strings"
	"sync"
	"time"

	"mylife-tools-server/config"
	"mylife-tools-server/log"
	"mylife-tools-server/services"
	"mylife-tools-server/utils"

	"github.com/fsnotify/fsnotify"
)

var logger = log.CreateLogger("mylife:money:secrets")

type secretsConfig struct {
	Path string `mapstructure:"path"`
}

// Note: on k3s, secrets folder looks empty at container startup, but files are mounted later.
// We refresh the secrets with fswatcher.

type secretService struct {
	path          string
	watcher       *fsnotify.Watcher
	watcherWorker *utils.Worker
	values        map[string]string
	valuesLock    sync.RWMutex
}

func (service *secretService) Init(arg interface{}) error {
	conf := secretsConfig{}
	config.BindStructure("secrets", &conf)

	service.path = conf.Path

	if err := service.reload(); err != nil {
		return fmt.Errorf("failed to load secrets: %w", err)
	}

	// Setup watcher
	watcher, err := fsnotify.NewWatcher()
	if err != nil {
		return fmt.Errorf("failed to create fsnotify watcher: %w", err)
	}

	if err := watcher.Add(service.path); err != nil {
		return fmt.Errorf("failed to add secrets directory to watcher: %w", err)
	}

	service.watcher = watcher
	service.watcherWorker = utils.NewWorker(service.watcherWorkerCallback)

	return nil
}

func (service *secretService) Terminate() error {
	service.watcher.Close()
	service.watcherWorker.Terminate()

	return nil
}

func (service *secretService) watcherWorkerCallback(exit chan struct{}) {
	events := service.watcher.Events
	errors := service.watcher.Errors

	// batch reloads to avoid multiple reloads if multiple events are triggered
	pendingReloads := false

	for {
		select {
		case event, ok := <-events:
			if !ok {
				events = nil
				continue
			}

			_ = event // We don't care about the specific event type, just that something changed
			pendingReloads = true

		case err, ok := <-errors:
			if !ok {
				errors = nil
				continue
			}

			logger.WithError(err).Error("Watcher error")

		case <-time.After(1 * time.Second):
			// If we have pending reloads, we can do it now
			if pendingReloads {
				if err := service.reload(); err != nil {
					logger.WithError(err).Error("Failed to reload secrets")
				}

				pendingReloads = false
			}

		case <-exit:
			return
		}
	}
}

func (service *secretService) reload() error {

	entries, err := os.ReadDir(service.path)
	if err != nil {
		return fmt.Errorf("failed to read secrets directory: %w", err)
	}

	newValues := make(map[string]string)
	logger.Info("reloading secrets")

	for _, entry := range entries {
		if !entry.Type().IsRegular() {
			continue
		}

		filePath := fmt.Sprintf("%s/%s", service.path, entry.Name())
		data, err := os.ReadFile(filePath)
		if err != nil {
			return fmt.Errorf("failed to read secret file %s: %w", filePath, err)
		}

		logger.WithField("name", entry.Name()).Info("reloaded secret")
		newValues[entry.Name()] = string(data)
	}

	service.valuesLock.Lock()
	defer service.valuesLock.Unlock()
	service.values = newValues

	return nil
}

func (service *secretService) ServiceName() string {
	return "secrets"
}

func (service *secretService) Dependencies() []string {
	return []string{}
}

func (service *secretService) FindSecret(key string) (string, bool) {
	service.valuesLock.RLock()
	defer service.valuesLock.RUnlock()

	val, ok := service.values[key]
	return val, ok
}

func (service *secretService) GetSecret(key string) (string, error) {
	if value, ok := service.FindSecret(key); ok {
		return value, nil
	}

	return "", fmt.Errorf("secret %s not found", key)
}

const secretPrefix = "secret:"

func (service *secretService) ProcessField(value string) string {
	if !strings.HasPrefix(value, secretPrefix) {
		return value
	}

	key := value[len(secretPrefix):]
	secretValue, ok := service.FindSecret(key)
	if !ok {
		logger.Warningf("Secret key '%s' does not exist.", key)
		return value
	}

	logger.Debugf("Using secret key '%s'.", key)
	return secretValue
}

func init() {
	services.Register(&secretService{})
}

func getService() *secretService {
	return services.GetService[*secretService]("secrets")
}

// Public access

func FindSecret(key string) (string, bool) {
	return getService().FindSecret(key)
}

func GetSecret(key string) (string, error) {
	return getService().GetSecret(key)
}

func ProcessField(value string) string {
	return getService().ProcessField(value)
}

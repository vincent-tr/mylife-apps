package secrets

import (
	"fmt"
	"mylife-tools-server/config"
	"mylife-tools-server/log"
	"mylife-tools-server/services"
	"os"
)

var logger = log.CreateLogger("mylife:money:secrets")

type secretsConfig struct {
	Path string `mapstructure:"path"`
}

type secretService struct {
	// No watch for now
	values map[string]string
}

func (service *secretService) Init(arg interface{}) error {
	conf := secretsConfig{}
	config.BindStructure("secrets", &conf)

	service.values = make(map[string]string)

	entries, err := os.ReadDir(conf.Path)
	if err != nil {
		return fmt.Errorf("failed to read secrets directory: %w", err)
	}

	for _, entry := range entries {
		if !entry.Type().IsRegular() {
			continue
		}

		filePath := fmt.Sprintf("%s/%s", conf.Path, entry.Name())
		data, err := os.ReadFile(filePath)
		if err != nil {
			return fmt.Errorf("failed to read secret file %s: %w", filePath, err)
		}

		logger.WithField("name", entry.Name()).Info("loaded secret")
		service.values[entry.Name()] = string(data)
	}

	return nil
}

func (service *secretService) Terminate() error {

	return nil
}

func (service *secretService) ServiceName() string {
	return "secrets"
}

func (service *secretService) Dependencies() []string {
	return []string{}
}

func (service *secretService) FindSecret(key string) (string, bool) {
	val, ok := service.values[key]
	return val, ok
}

func (service *secretService) GetSecret(key string) (string, error) {
	if value, ok := service.FindSecret(key); ok {
		return value, nil
	}

	return "", fmt.Errorf("secret %s not found", key)
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

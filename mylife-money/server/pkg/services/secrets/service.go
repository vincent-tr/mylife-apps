package secrets

import (
	"fmt"
	"mylife-tools/config"
	"mylife-tools/log"
	"mylife-tools/services"
	"os"
	"strings"
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
		// Note:
		// - kube secrets files are symlinks
		// - kube secrets contains directories to ignore
		// - kube secrets contains symlinks to directories to ignore

		filePath := fmt.Sprintf("%s/%s", conf.Path, entry.Name())
		data, err := os.ReadFile(filePath)
		if err != nil {
			if strings.Contains(err.Error(), "is a directory") {
				logger.WithField("name", entry.Name()).Debug("skipping directory in secrets")
				continue
			}

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

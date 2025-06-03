package common

import (
	"mylife-money/pkg/services/secrets"
	"strings"
)

const secretPrefix = "secret:"

func ProcessSecret(logger *ExecutionLogger, value string) string {
	if !strings.HasPrefix(value, secretPrefix) {
		return value
	}

	key := value[len(secretPrefix):]
	secretValue, ok := secrets.FindSecret(key)
	if !ok {
		logger.Warningf("La clé de secret '%s' n'existe pas.", key)
		return value
	}

	logger.Debugf("Utilisation du secret de la clé '%s'.", key)
	return secretValue
}

type MailFetcherConfig struct {
	Server string `mapstructure:"server"`
	User   string `mapstructure:"user"`
	Pass   string `mapstructure:"pass"`
}

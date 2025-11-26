package mailsender

import (
	"fmt"
	"mylife-money/pkg/services/secrets"
	"mylife-tools/config"
	"mylife-tools/log"
	"mylife-tools/services"
)

var logger = log.CreateLogger("mylife:money:mail-sender")

type MailAttachment struct {
	FileName    string
	ContentType string // Infered from file name extension if empty
	Data        []byte
}

type BodyType string

const BodyTypeText BodyType = "text/plain"
const BodyTypeHtml BodyType = "text/html"

type Mail struct {
	Subject     string
	Body        string
	BodyType    BodyType
	Attachments []MailAttachment
}

type mailSenderConfig struct {
	SmtpServer string   `mapstructure:"smtp-server"`
	SmtpPort   int      `mapstructure:"smtp-port"`
	User       string   `mapstructure:"user"`
	Pass       string   `mapstructure:"pass"`
	From       string   `mapstructure:"from"`
	To         []string `mapstructure:"to"`
}

type mailSenderService struct {
	config mailSenderConfig
}

func (service *mailSenderService) Init(arg interface{}) error {
	config.BindStructure("mail-sender", &service.config)

	if service.config.SmtpServer == "" || service.config.SmtpPort == 0 {
		return fmt.Errorf("SMTP server and port must be set")
	}

	return nil
}

func (service *mailSenderService) Terminate() error {

	return nil
}

func (service *mailSenderService) ServiceName() string {
	return "mail-sender"
}

func (service *mailSenderService) Dependencies() []string {
	return []string{"secrets"}
}

func (service *mailSenderService) processConfig() *mailSenderConfig {
	config := &mailSenderConfig{
		SmtpServer: secrets.ProcessField(service.config.SmtpServer),
		SmtpPort:   service.config.SmtpPort,
		User:       secrets.ProcessField(service.config.User),
		Pass:       secrets.ProcessField(service.config.Pass),
		From:       secrets.ProcessField(service.config.From),
		To:         make([]string, len(service.config.To)),
	}

	for i, to := range service.config.To {
		config.To[i] = secrets.ProcessField(to)
	}

	return config
}

func init() {
	services.Register(&mailSenderService{})
}

func getService() *mailSenderService {
	return services.GetService[*mailSenderService]("mail-sender")
}

// Public access

func SendMail(mail *Mail) error {
	return getService().SendMail(mail)
}

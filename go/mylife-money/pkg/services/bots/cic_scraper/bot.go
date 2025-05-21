package cicscraper

import (
	"context"
	"fmt"
	"mylife-money/pkg/business"
	"mylife-money/pkg/entities"
	"mylife-money/pkg/services/bots/common"
	mailsender "mylife-money/pkg/services/mail_sender"
	"mylife-tools-server/services/store"
	"mylife-tools-server/services/tasks"
	"net/http"
	"net/http/cookiejar"
	"time"
)

type Config struct {
	Schedule *string `mapstructure:"schedule"`
	User     string  `mapstructure:"user"`
	Pass     string  `mapstructure:"pass"`
	Account  string  `mapstructure:"account"`
}

type bot struct {
	config *Config

	// only set when the bot is running
	ctx    context.Context
	logger *common.ExecutionLogger
	client *http.Client
}

func (b *bot) Type() entities.BotType {
	return entities.BotTypeCicScraper
}

func (b *bot) Schedule() *string {
	return b.config.Schedule
}

func (b *bot) Run(ctx context.Context, logger *common.ExecutionLogger) error {
	b.ctx = ctx
	b.logger = logger
	defer func() {
		b.ctx = nil
		b.logger = nil
	}()

	jar, err := cookiejar.New(nil)
	if err != nil {
		return fmt.Errorf("failed to create cookie jar: %w", err)
	}

	b.client = &http.Client{}
	b.client.Jar = jar
	defer func() {
		if b.client != nil {
			b.client.CloseIdleConnections()
		}
		b.client = nil
	}()

	if err := b.authenticate(); err != nil {
		return fmt.Errorf("failed to authenticate: %w", err)
	}

	data, err := b.download()
	if err != nil {
		return fmt.Errorf("failed to download: %w", err)
	}

	if err := b.sendMail(data); err != nil {
		return fmt.Errorf("failed to send mail: %w", err)
	}

	wrapper := newErrorWrapper(func() error {
		account, err := b.getAccountId()
		if err != nil {
			return err
		}

		importedCount, err := business.OperationsImport(account, string(data))
		if err != nil {
			return fmt.Errorf("failed to import operations: %w", err)
		}

		b.logger.Infof("%d opérations importées", importedCount)

		movedCount, err := business.ExecuteRules()
		if err != nil {
			return fmt.Errorf("failed to execute rules: %w", err)
		}

		b.logger.Infof("Exécution des règles : %d opérations classées", movedCount)

		return nil
	})

	err = tasks.RunEventLoop("cic-scraper/import-operations", wrapper.Run)

	if err != nil {
		return err
	}

	return wrapper.Error()
}

var _ common.Bot = (*bot)(nil)

func NewBot(config *Config) common.Bot {
	return &bot{
		config: config,
	}
}

func (b *bot) getAccountId() (string, error) {
	accounts, err := store.GetCollection[*entities.Account]("accounts")
	if err != nil {
		return "", err
	}

	list := accounts.Filter(func(a *entities.Account) bool {
		return a.Code() == b.config.Account
	})

	if len(list) == 0 {
		return "", fmt.Errorf("account %s not found", b.config.Account)
	}

	if len(list) > 1 {
		return "", fmt.Errorf("multiple accounts found for code %s", b.config.Account)
	}

	return list[0].Id(), nil
}

func (b *bot) sendMail(data []byte) error {
	mail := &mailsender.Mail{
		Subject:  "CIC - Importation des opérations",
		Body:     "Bonjour,\n\nVeuillez trouver ci-joint le fichier d'importation des opérations.\n\nCordialement,\nL'équipe MyLife",
		BodyType: mailsender.BodyTypeText,
		Attachments: []mailsender.MailAttachment{
			{
				FileName: fmt.Sprintf("operations-cic-%s.csv", time.Now().Format("20060102-150405")),
				Data:     data,
			},
		},
	}

	return mailsender.SendMail(mail)
}

type errorWrapper struct {
	err    error
	target func() error
}

func newErrorWrapper(target func() error) *errorWrapper {
	return &errorWrapper{
		target: target,
	}
}

func (ew *errorWrapper) Error() error {
	return ew.err
}

func (ew *errorWrapper) Run() {
	ew.err = ew.target()
}

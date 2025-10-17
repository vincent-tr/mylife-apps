package mailsender

import (
	"io"
	"mime"
	"path/filepath"

	"gopkg.in/gomail.v2"
)

func (service *mailSenderService) SendMail(mail *Mail) error {
	config := service.processConfig()
	msg := service.buildMessage(config, mail)
	dialer := gomail.NewDialer(config.SmtpServer, config.SmtpPort, config.User, config.Pass)
	return dialer.DialAndSend(msg)
}

func (service *mailSenderService) buildMessage(config *mailSenderConfig, mail *Mail) *gomail.Message {
	msg := gomail.NewMessage()

	msg.SetHeader("From", config.From)
	msg.SetHeader("To", config.To...)
	msg.SetHeader("Subject", mail.Subject)
	msg.SetBody(string(mail.BodyType), mail.Body)

	for _, attachment := range mail.Attachments {
		contentType := attachment.ContentType

		if contentType == "" {
			ext := filepath.Ext(attachment.FileName)
			if ext == "" {
				contentType = "application/octet-stream"
			} else {
				contentType = mime.TypeByExtension(ext)
			}
		}

		headers := map[string][]string{
			"Content-Type": {contentType},
		}

		copyFunc := func(w io.Writer) error {
			_, err := w.Write(attachment.Data)
			return err
		}

		msg.Attach(
			"",
			gomail.Rename(attachment.FileName),
			gomail.SetCopyFunc(copyFunc),
			gomail.SetHeader(headers),
		)
	}

	return msg
}

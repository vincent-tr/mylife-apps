package common

import (
	"bytes"
	"context"
	"encoding/base64"
	"fmt"
	"io"
	"mime/quotedprintable"
	"strings"
	"time"

	"github.com/emersion/go-imap/v2"
	"github.com/emersion/go-imap/v2/imapclient"
)

// TODO: better context

type MailFetcher struct {
	ctx    context.Context
	client *imapclient.Client
}

func NewMailFetcher(ctx context.Context, logger *ExecutionLogger, config *MailFetcherConfig, mailbox string) (*MailFetcher, error) {
	user := ProcessSecret(logger, config.User)
	pass := ProcessSecret(logger, config.Pass)

	client, err := imapclient.DialTLS(config.Server, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to IMAP server: %w", err)
	}

	mf := &MailFetcher{
		ctx,
		client,
	}

	if err := mf.checkContext(); err != nil {
		mf.Close()
		return nil, err
	}

	if err := client.Login(user, pass).Wait(); err != nil {
		client.Close()
		return nil, fmt.Errorf("failed to login to IMAP server: %w", err)
	}

	if err := mf.checkContext(); err != nil {
		mf.Close()
		return nil, err
	}

	_, err = client.Select(mailbox, &imap.SelectOptions{ReadOnly: true}).Wait()
	if err != nil {
		client.Close()
		return nil, fmt.Errorf("failed to connect to IMAP server: %w", err)
	}

	if err := mf.checkContext(); err != nil {
		mf.Close()
		return nil, err
	}

	return mf, nil
}

func (mf *MailFetcher) Close() error {
	if err := mf.client.Close(); err != nil {
		return fmt.Errorf("failed to close IMAP client: %w", err)
	}

	return nil
}

// From: optional
//
// Subject: optional
func (mf *MailFetcher) FetchMails(from string, subject string, sinceDays int) ([]*MailMessage, error) {

	criteria := &imap.SearchCriteria{
		Since:  time.Now().AddDate(0, 0, -sinceDays),
		Header: []imap.SearchCriteriaHeaderField{},
	}

	if from != "" {
		criteria.Header = append(criteria.Header, imap.SearchCriteriaHeaderField{Key: "FROM", Value: from})
	}

	if subject != "" {
		criteria.Header = append(criteria.Header, imap.SearchCriteriaHeaderField{Key: "SUBJECT", Value: subject})
	}

	searchData, err := mf.client.UIDSearch(criteria, nil).Wait()
	if err != nil {
		return nil, fmt.Errorf("failed to search emails: %w", err)
	}

	if err := mf.checkContext(); err != nil {
		return nil, err
	}

	msgs, err := mf.client.Fetch(imap.UIDSetNum(searchData.AllUIDs()...), &imap.FetchOptions{
		UID:           true,
		Envelope:      true,
		BodyStructure: &imap.FetchItemBodyStructure{Extended: true},
	}).Collect()
	if err != nil {
		return nil, fmt.Errorf("failed to fetch emails: %w", err)
	}

	if err := mf.checkContext(); err != nil {
		return nil, err
	}

	var mailMessages []*MailMessage
	for _, msg := range msgs {
		mailMessages = append(mailMessages, &MailMessage{
			owner: mf,
			msg:   msg,
		})
	}

	return mailMessages, nil
}

func (mf *MailFetcher) checkContext() error {
	return mf.ctx.Err()
}

type MailMessage struct {
	owner *MailFetcher
	msg   *imapclient.FetchMessageBuffer
}

func (mm *MailMessage) FindPartByType(mediaType string) *MailPart {
	var mailPart *MailPart

	mm.msg.BodyStructure.Walk(func(path []int, part imap.BodyStructure) bool {
		if mailPart != nil {
			return false // already found the part
		}

		singlePart, ok := part.(*imap.BodyStructureSinglePart)
		if !ok || part.MediaType() != mediaType {
			return true // continue walking
		}

		mailPart = &MailPart{
			owner:            mm.owner,
			uid:              mm.msg.UID,
			transferEncoding: singlePart.Encoding,
			path:             path,
		}

		return false // stop walking
	})

	return mailPart
}

func (mm *MailMessage) UID() imap.UID {
	return mm.msg.UID
}

func (mm *MailMessage) Date() time.Time {
	return mm.msg.Envelope.Date
}

type MailPart struct {
	owner            *MailFetcher
	uid              imap.UID
	path             []int
	transferEncoding string
}

func (mp *MailPart) Download() ([]byte, error) {
	uidSet := imap.UIDSetNum(mp.uid)
	fetchOptions := &imap.FetchOptions{
		BodySection: []*imap.FetchItemBodySection{
			{Part: mp.path},
		},
	}

	data, err := mp.owner.client.Fetch(uidSet, fetchOptions).Collect()
	if err != nil {
		return nil, fmt.Errorf("failed to fetch message %d: %w", mp.uid, err)
	}

	if err := mp.owner.checkContext(); err != nil {
		return nil, err
	}

	raw := data[0].BodySection[0].Bytes

	switch strings.ToLower(mp.transferEncoding) {
	case "7bit", "8bit", "binary":
		return raw, nil

	case "base64":
		decoded, err := base64.StdEncoding.DecodeString(string(raw))
		if err != nil {
			return nil, fmt.Errorf("failed to decode base64 for message %d: %w", mp.uid, err)
		}
		return decoded, nil

	case "quoted-printable":
		decoded, err := io.ReadAll(quotedprintable.NewReader(bytes.NewReader(raw)))
		if err != nil {
			return nil, fmt.Errorf("failed to decode quoted-printable for message %d: %w", mp.uid, err)
		}
		return decoded, nil

	default:
		return nil, fmt.Errorf("unsupported transfer encoding %q for message %d", mp.transferEncoding, mp.uid)
	}
}

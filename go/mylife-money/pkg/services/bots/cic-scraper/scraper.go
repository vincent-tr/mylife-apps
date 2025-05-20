package cicscraper

import (
	"fmt"
	"io"
	"mylife-money/pkg/services/bots/common"
	"net/http"
	"net/url"
	"regexp"
	"strings"
	"time"

	"github.com/PuerkitoBio/goquery"
	"golang.org/x/net/html"
)

const authUrl = "https://www.cic.fr/fr/authentification.html"
const accueilUrl = "https://www.cic.fr/fr/banque/pageaccueil.html"
const validationUrl = "https://www.cic.fr/fr/banque/validation.aspx"
const downloadUrl = "https://www.cic.fr/fr/banque/compte/telechargement.cgi"

const authCheckInterval = 5 * time.Second
const authTimeout = 1 * time.Minute

func (b *bot) authenticate() error {

	user := common.ProcessSecret(b.logger, b.config.User)
	pass := common.ProcessSecret(b.logger, b.config.Pass)

	_, err := b.httpProcess(authUrl, nil, nil)
	if err != nil {
		return err
	}

	data := map[string]string{
		"_cm_user":  user,
		"_cm_pwd":   pass,
		"flag":      "password",
		"_charset_": "UTF-8",
	}

	resp, err := b.httpProcess(authUrl, data, nil)
	if err != nil {
		return err
	}

	switch resp.requestUrl {
	case accueilUrl:
		b.logger.Info("Login successful")
		return nil

	case validationUrl:
		b.logger.Info("Validation required")

	default:
		return fmt.Errorf("Login failed: unknown response '%s'", resp.requestUrl)
	}

	transactionId, err := resp.FindJsValue("transactionId")
	if err != nil {
		return err
	}

	getTransactionValidationStateUrl, err := resp.FindJsValue("getTransactionValidationStateUrl")
	if err != nil {
		return err
	}

	doc, err := resp.ToDoc()
	if err != nil {
		return err
	}

	validator := doc.Find("div[id='C:O:B:I1:inMobileAppMessage']").ChildrenFiltered(".otpFontSizeIncreased").ChildrenFiltered("span").Text()
	b.logger.Infof("Authentification forte requise : %s\n", validator)

	b.logger.Debugf("Transaction ID: '%s'", transactionId)
	b.logger.Debugf("Validation URL: '%s'", getTransactionValidationStateUrl)

	form := doc.Find("form[id='C:P:F']")

	action, exists := form.Attr("action")
	if !exists {
		return fmt.Errorf("Form action not found")
	}

	formData := make(map[string]string)

	for _, node := range form.Find("input[type=hidden]").Nodes {
		name, err := b.findAttribute(node, "name")
		if err != nil {
			return err
		}

		value, err := b.findAttribute(node, "value")
		if err != nil {
			return err
		}

		formData[name] = value
	}

	// note: if we miss that it seems to fail ..
	formData["_FID_DoValidate.x"] = "0"
	formData["_FID_DoValidate.y"] = "0"

	if err := b.waitAuth(transactionId, getTransactionValidationStateUrl); err != nil {
		return err
	}

	headers := map[string]string{
		"Referer": validationUrl,
	}

	resp, err = b.httpProcess(fmt.Sprintf("https://www.cic.fr%s", action), formData, headers)
	if err != nil {
		return err
	}

	if !strings.HasPrefix(resp.requestUrl, accueilUrl) {
		return fmt.Errorf("unexpected URL: %s", resp.requestUrl)
	}

	return nil
}

func (b *bot) waitAuth(transactionId string, getTransactionValidationStateUrl string) error {
	startDate := time.Now()
	exitLoop := false
	for !exitLoop {
		postData := map[string]string{
			"transactionId": transactionId,
		}

		resp, err := b.httpProcess(getTransactionValidationStateUrl, postData, nil)
		if err != nil {
			return err
		}

		status, err := resp.FindMatch("<root><code_retour>0000</code_retour><transactionState>([A-Z]*)</transactionState></root>")
		if err != nil {
			return err
		}

		switch status {
		case "PENDING":
			b.logger.Info("En attente d'authentification")

		case "VALIDATED":
			b.logger.Info("Authentification validée")
			exitLoop = true

		default:
			return fmt.Errorf("unexpected status '%s'", status)
		}

		if exitLoop {
			break
		}

		elapsed := time.Since(startDate)
		if elapsed > authTimeout {
			return fmt.Errorf("Timeout while waiting for authentication")
		}

		time.Sleep(authCheckInterval)
	}

	return nil
}

func (b *bot) findAttribute(node *html.Node, attr string) (string, error) {
	for _, n := range node.Attr {
		if n.Key == attr {
			return n.Val, nil
		}
	}
	return "", fmt.Errorf("attribute '%s' not found", attr)
}

func (b *bot) httpProcess(targetUrl string, postData map[string]string, headers map[string]string) (*response, error) {
	method := http.MethodGet
	var reqBody io.Reader

	if postData != nil {
		method = http.MethodPost

		form := url.Values{}
		for k, v := range postData {
			form.Add(k, v)
		}
		reqBody = strings.NewReader(form.Encode())
	}

	req, err := http.NewRequestWithContext(b.ctx, method, targetUrl, reqBody)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	if postData != nil {
		req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	}

	if headers != nil {
		for k, v := range headers {
			req.Header.Set(k, v)
		}
	}

	resp, err := b.client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("failed to get page '%s': %w", targetUrl, err)
	}

	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response body: %w", err)
	}

	return &response{
		body:       string(bodyBytes),
		requestUrl: resp.Request.URL.String(),
	}, nil
}

type response struct {
	body       string
	requestUrl string
}

func (resp *response) Body() string {
	return resp.body
}

func (resp *response) FindJsValue(key string) (string, error) {
	rx := regexp.MustCompile(fmt.Sprintf("%s: '([^']*)'", key))
	matches := rx.FindStringSubmatch(resp.body)

	if len(matches) < 2 {
		return "", fmt.Errorf("Value not found for key '%s'", key)
	}
	return matches[1], nil
}

func (resp *response) FindMatch(pattern string) (string, error) {
	rx := regexp.MustCompile(pattern)
	matches := rx.FindStringSubmatch(resp.body)
	if len(matches) < 2 {
		fmt.Errorf("unexpected response: %s", resp.body)
	}
	return matches[1], nil
}

func (resp *response) ToDoc() (*goquery.Document, error) {
	return goquery.NewDocumentFromReader(strings.NewReader(resp.body))
}

package cicscraper

import (
	"bytes"
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

const downloadRetryInterval = 5 * time.Second
const downloadMaxRetries = 10

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
	validator = strings.TrimSpace(validator)
	b.logger.Infof("Authentification forte requise : %s", validator)

	// 	b.logger.Debugf("Transaction ID: '%s'", transactionId)
	//	b.logger.Debugf("Validation URL: '%s'", getTransactionValidationStateUrl)

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

func (b *bot) download() ([]byte, error) {

	for retry := 0; ; retry++ {

		resp, err := b.httpProcess(downloadUrl, nil, nil)
		if err != nil {
			return nil, err
		}

		doc, err := resp.ToDoc()
		if err != nil {
			return nil, err
		}

		form := doc.Find("form[id='P:F']")

		action, exists := form.Attr("action")
		if !exists {
			return nil, fmt.Errorf("Form action not found")
		}

		cpt, exists := form.Find("input[name='_CPT'").First().Attr("value")
		if !exists {
			cpt = ""
		}

		formData := map[string]string{
			// picked from Chrome session dev tools
			"data_formats_selected":                         "csv",
			"data_formats_options_cmi_download":             "0",
			"data_formats_options_ofx_format":               "7",
			"Bool:data_formats_options_ofx_zonetiers":       "false",
			"CB:data_formats_options_ofx_zonetiers":         "on",
			"data_formats_options_qif_fileformat":           "6",
			"data_formats_options_qif_dateformat":           "0",
			"data_formats_options_qif_amountformat":         "0",
			"data_formats_options_qif_headerformat":         "0",
			"Bool:data_formats_options_qif_zonetiers":       "false",
			"CB:data_formats_options_qif_zonetiers":         "on",
			"data_formats_options_csv_fileformat":           "2",
			"data_formats_options_csv_dateformat":           "0",
			"data_formats_options_csv_fieldseparator":       "0",
			"data_formats_options_csv_amountcolnumber":      "1",
			"data_formats_options_csv_decimalseparator":     "0",
			"Bool:data_accounts_account_ischecked":          "true",
			"CB:data_accounts_account_ischecked":            "on",
			"Bool:data_accounts_account_2__ischecked":       "false",
			"Bool:data_accounts_account_3__ischecked":       "false",
			"Bool:data_accounts_account_4__ischecked":       "false",
			"Bool:data_accounts_account_5__ischecked":       "false",
			"Bool:data_accounts_account_6__ischecked":       "false",
			"data_daterange_value":                          "all",
			"_FID_DoDownload.x":                             "65",
			"_FID_DoDownload.y":                             "17",
			"data_accounts_selection":                       "100000000000",
			"data_formats_options_cmi_show":                 "True",
			"data_formats_options_qif_show":                 "True",
			"data_formats_options_excel_show":               "True",
			"data_formats_options_csv_show":                 "True",
			"[t:dbt%3adate;]data_daterange_startdate_value": "",
			"[t:dbt%3adate;]data_daterange_enddate_value":   "",

			// The only custom
			"_CPT": cpt,
		}

		headers := map[string]string{
			"Referer": downloadUrl,
			"Accept":  "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
		}

		resp, err = b.httpProcess(fmt.Sprintf("https://www.cic.fr%s", action), formData, headers)
		if err != nil {
			return nil, err
		}

		contentDisposition := resp.headers.Get("content-disposition")
		isResponseOk := strings.HasPrefix(contentDisposition, "attachment")

		if isResponseOk {
			data := resp.bodyBytes

			b.logger.Infof("Téléchargé un fichier de %d octets", len(data))

			return data, nil
		}

		if retry < downloadMaxRetries {
			b.logger.Warningf("Unexpected response, expected attachment (try %d)", retry)
			time.Sleep(downloadRetryInterval)
			continue
		}

		break
	}

	return nil, fmt.Errorf("Unexpected response, expected attachment after %d retries", downloadMaxRetries)
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

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response body: %w", err)
	}

	return &response{
		bodyBytes:  body,
		bodyString: string(body),
		requestUrl: resp.Request.URL.String(),
		headers:    resp.Header,
	}, nil
}

type response struct {
	bodyBytes  []byte
	bodyString string
	requestUrl string
	headers    http.Header
}

func (resp *response) FindJsValue(key string) (string, error) {
	rx := regexp.MustCompile(fmt.Sprintf("%s: '([^']*)'", key))
	matches := rx.FindStringSubmatch(resp.bodyString)

	if len(matches) < 2 {
		return "", fmt.Errorf("Value not found for key '%s'", key)
	}
	return matches[1], nil
}

func (resp *response) FindMatch(pattern string) (string, error) {
	rx := regexp.MustCompile(pattern)
	matches := rx.FindStringSubmatch(resp.bodyString)
	if len(matches) < 2 {
		fmt.Errorf("unexpected response: %s", resp.bodyString)
	}
	return matches[1], nil
}

func (resp *response) ToDoc() (*goquery.Document, error) {
	return goquery.NewDocumentFromReader(bytes.NewReader(resp.bodyBytes))
}

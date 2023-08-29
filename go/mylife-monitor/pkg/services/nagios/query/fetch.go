package query

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

const (
	urlSuffixObjectHostGroupList string = "nagios/cgi-bin/objectjson.cgi?query=hostgrouplist&details=true"
	urlSuffixStatusHostList      string = "nagios/cgi-bin/statusjson.cgi?query=hostlist&details=true"
	urlSuffixStatusServiceList   string = "nagios/cgi-bin/statusjson.cgi?query=servicelist&details=true"
)

func query[T any](ctx context.Context, authHeader string, baseUrl string, urlSuffix string, data T) error {

	req, err := http.NewRequestWithContext(ctx, "GET", baseUrl+urlSuffix, nil)
	if err != nil {
		return err
	}

	req.Header["Authorization"] = []string{authHeader}

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}

	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	result := queryResult[T]{
		Data: data,
	}

	err = json.Unmarshal(body, &result)
	if err != nil {
		return err
	}

	if result.Result.TypeCode != 0 {
		return fmt.Errorf("Nagios API error (%d): %s - %s", result.Result.TypeCode, result.Result.TypeText, result.Result.Message)
	}

	return nil
}

func FetchHostGroupList(ctx context.Context, authHeader string, baseUrl string) (HostGroupList, error) {
	var data HostGroupList

	err := query(ctx, authHeader, baseUrl, urlSuffixObjectHostGroupList, &data)

	return data, err
}

func FetchHostList(ctx context.Context, authHeader string, baseUrl string) (HostList, error) {
	var data HostList

	err := query(ctx, authHeader, baseUrl, urlSuffixStatusHostList, &data)

	return data, err
}

func FetchServiceList(ctx context.Context, authHeader string, baseUrl string) (ServiceList, error) {
	var data ServiceList

	err := query(ctx, authHeader, baseUrl, urlSuffixStatusServiceList, &data)

	return data, err
}

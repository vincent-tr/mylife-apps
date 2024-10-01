package unifi

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

func fetchOnline(ctx context.Context, filters ...filter) ([]version, error) {

	// "https://fw-update.ubnt.com/api/firmware-latest"
	req, err := http.NewRequestWithContext(ctx, "GET", "https://fw-update.ubnt.com/api/firmware", nil)
	if err != nil {
		return nil, err
	}

	query := req.URL.Query()
	for _, filter := range filters {
		query.Add("filter", fmt.Sprintf("%s~~%s~~%s", filter.Operator, filter.Field, filter.Value))
	}
	req.URL.RawQuery = query.Encode()

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	data, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	var wrapper wrapper1
	err = json.Unmarshal(data, &wrapper)
	if err != nil {
		return nil, err
	}

	return wrapper.Data.Data, nil
}

type filter struct {
	Operator string // only 'eq' for now
	Field    string
	Value    string
}

type wrapper1 struct {
	Data wrapper2 `json:"_embedded"`
	// _links
}

type wrapper2 struct {
	Data []version `json:"firmware"`
}

type version struct {
	Channel string    `json:"channel"`
	Created time.Time `json:"created"` // "2024-05-08T09:27:41Z"
	// file_size
	// id
	// md5
	// sha256_checksum
	Platform     string    `json:"platform"`
	Product      string    `json:"product"`
	Updated      time.Time `json:"updated"`       // "2024-05-08T09:27:45Z"
	Version      string    `json:"version"`       // "v7.0.50+15613"
	VersionMajor int       `json:"version_major"` // 7,
	VersionMinor int       `json:"version_minor"` // 0,
	VersionPatch int       `json:"version_patch"` // 50,
	VersionBuild string    `json:"version_build"` // "15613"
	// probability_computed
	// _links
}

func (ver *version) String() string {
	return fmt.Sprintf("%d.%d.%d.%s", ver.VersionMajor, ver.VersionMinor, ver.VersionPatch, ver.VersionBuild)
}

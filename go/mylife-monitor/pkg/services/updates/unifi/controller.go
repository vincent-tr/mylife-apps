package unifi

import (
	"time"

	"github.com/unpoller/unifi"
)

type device struct {
	Site    string
	Name    string
	Model   string
	Version string
}

func fetchController(controller string, user string, pass string) ([]*device, error) {
	conf := &unifi.Config{
		User:     user,
		Pass:     pass,
		URL:      controller,
		ErrorLog: logger.Errorf,
		DebugLog: logger.Debugf,
		Timeout:  time.Second * 60,
	}

	client, err := unifi.NewUnifi(conf)
	if err != nil {
		return nil, err
	}

	sites, err := client.GetSites()
	if err != nil {
		return nil, err
	}

	devices, err := client.GetDevices(sites)
	if err != nil {
		return nil, err
	}

	res := make([]*device, 0)

	for _, dev := range devices.UAPs {
		res = append(res, &device{
			Site:    dev.SiteName,
			Name:    dev.Name,
			Model:   dev.Model,
			Version: dev.Version,
		})
	}

	for _, dev := range devices.USGs {
		res = append(res, &device{
			Site:    dev.SiteName,
			Name:    dev.Name,
			Model:   dev.Model,
			Version: dev.Version,
		})
	}

	for _, dev := range devices.USWs {
		res = append(res, &device{
			Site:    dev.SiteName,
			Name:    dev.Name,
			Model:   dev.Model,
			Version: dev.Version,
		})
	}

	return res, nil
}

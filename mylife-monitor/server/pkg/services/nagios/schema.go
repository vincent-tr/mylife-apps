package nagios

import (
	"fmt"
	"mylife-monitor/pkg/entities"
	"mylife-monitor/pkg/services/nagios/query"
	"mylife-tools/services/store"
	"time"
)

type groupData struct {
	group   *entities.NagiosHostGroupValues
	members []string
}

type schema struct {
	groups   map[string]*groupData
	hosts    map[string]*entities.NagiosHostValues
	services map[string]*entities.NagiosServiceValues
}

func newSchema() schema {
	return schema{
		groups:   make(map[string]*groupData),
		hosts:    make(map[string]*entities.NagiosHostValues),
		services: make(map[string]*entities.NagiosServiceValues),
	}
}

func (this *schema) addObjectHostGroupList(data query.HostGroupList) {
	for _, item := range data.HostGroupList {
		this.addObjectHostGroup(item)
	}
}

func (this *schema) addObjectHostGroup(item query.HostGroup) {
	group := &entities.NagiosHostGroupValues{
		Id:      fmt.Sprintf("group:%s", item.GroupName),
		Code:    item.GroupName,
		Display: item.Alias,
	}

	this.groups[group.Id] = &groupData{
		group:   group,
		members: item.Members,
	}
}

func (this *schema) addStatusHostList(data query.HostList) {
	for _, item := range data.HostList {
		this.addStatusHost(item)
	}
}

func (this *schema) addStatusHost(item query.Host) {
	host := &entities.NagiosHostValues{
		Id:              fmt.Sprintf("host:%s", item.Name),
		Code:            item.Name,
		Display:         item.Name,
		Status:          parseHostStatus(item.Status),
		StatusText:      item.PluginOutput,
		CurrentAttempt:  item.CurrentAttempt,
		MaxAttempts:     item.MaxAttempts,
		LastCheck:       time.UnixMilli(item.LastCheck),
		NextCheck:       time.UnixMilli(item.NextCheck),
		LastStateChange: time.UnixMilli(item.LastStateChange),
		IsFlapping:      item.IsFlapping,
	}

	this.hosts[host.Id] = host
}

func (this *schema) addStatusServiceList(data query.ServiceList) {
	for _, host := range data.ServiceList {
		for _, item := range host {
			this.addStatusService(item)
		}
	}
}

func (this *schema) addStatusService(item query.Service) {
	service := &entities.NagiosServiceValues{
		Id:              fmt.Sprintf("service:%s:%s", item.HostName, item.Description),
		Host:            fmt.Sprintf("host:%s", item.HostName),
		Code:            item.Description,
		Display:         item.Description,
		Status:          parseServiceStatus(item.Status),
		StatusText:      item.PluginOutput,
		CurrentAttempt:  item.CurrentAttempt,
		MaxAttempts:     item.MaxAttempts,
		LastCheck:       time.UnixMilli(item.LastCheck),
		NextCheck:       time.UnixMilli(item.NextCheck),
		LastStateChange: time.UnixMilli(item.LastStateChange),
		IsFlapping:      item.IsFlapping,
	}

	this.services[service.Id] = service
}

func (this *schema) buildDataObjects() []store.Entity {
	objects := make([]store.Entity, 0)

	for _, groupData := range this.groups {
		for _, member := range groupData.members {
			host := this.hosts[fmt.Sprintf("host:%s", member)]

			// no atomicity
			if host == nil {
				continue
			}

			host.Group = groupData.group.Id
		}

		objects = append(objects, entities.NewNagiosHostGroup(groupData.group))
	}

	for _, host := range this.hosts {
		// no atomicity, drop it
		if host.Group == "" {
			continue
		}

		objects = append(objects, entities.NewNagiosHost(host))
	}

	for _, service := range this.services {
		host := this.hosts[service.Host]
		// no atomicity, drop it
		if host == nil {
			continue
		}

		objects = append(objects, entities.NewNagiosService(service))
	}

	return objects
}

var hostStatusMap = map[int]entities.NagiosHostStatus{
	1: entities.NagiosHostPending,
	2: entities.NagiosHostUp,
	4: entities.NagiosHostDown,
	8: entities.NagiosHostUnreachable,
}

func parseHostStatus(value int) entities.NagiosHostStatus {
	return hostStatusMap[value]
}

var serviceStatusMap = map[int]entities.NagiosServiceStatus{
	1:  entities.NagiosServicePending,
	2:  entities.NagiosServiceOk,
	4:  entities.NagiosServiceWarning,
	8:  entities.NagiosServiceUnknown,
	16: entities.NagiosServiceCritical,
}

func parseServiceStatus(value int) entities.NagiosServiceStatus {
	return serviceStatusMap[value]
}

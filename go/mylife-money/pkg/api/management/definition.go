package management

import (
	"mylife-money/pkg/business"
	"mylife-money/pkg/business/views"
	"mylife-tools-server/log"
	"mylife-tools-server/services/api"
	"mylife-tools-server/services/sessions"
)

var logger = log.CreateLogger("mylife:money:api:management")

var Definition = api.MakeDefinition("management", createGroup, updateGroup, deleteGroup, notifyOperations, moveOperations, operationsSetNote, operationsImport, operationsExecuteRules)

func createGroup(session *sessions.Session, arg struct{ Object business.ObjectValues }) (string, error) {
	res, err := business.CreateGroup(arg.Object)
	if err != nil {
		return "", err
	}

	logger.Infof("group created: %#v", res)
	return res.Id(), nil
}

func updateGroup(session *sessions.Session, arg struct{ Object business.ObjectValues }) (api.NoReturn, error) {
	res, err := business.UpdateGroup(arg.Object)
	if err != nil {
		return nil, err
	}

	logger.Infof("group updated: %#v", res)
	return nil, nil
}

func deleteGroup(session *sessions.Session, arg struct{ Id string }) (api.NoReturn, error) {

	err := business.DeleteGroup(arg.Id)
	if err != nil {
		return nil, err
	}

	logger.Infof("group deleted: %s", arg.Id)
	return nil, nil
}

func notifyOperations(session *sessions.Session, arg struct{ Criteria views.CriteriaValues }) (uint64, error) {
	return business.NotifyOperations(session, arg.Criteria)
}

func moveOperations(session *sessions.Session, arg struct {
	Group      *string
	Operations []string
}) (int, error) {
	count, err := business.OperationsMove(arg.Group, arg.Operations)
	if err != nil {
		return 0, err
	}

	logger.Infof("Operations moved: %#v %#v -> %d", arg.Group, arg.Operations, count)
	return count, nil
}

func operationsSetNote(session *sessions.Session, arg struct {
	Note       string
	Operations []string
}) (api.NoReturn, error) {
	count, err := business.OperationsSetNote(arg.Note, arg.Operations)
	if err != nil {
		return nil, err
	}

	logger.Infof("Operations note set: '%s' %#v -> %d", arg.Note, arg.Operations, count)

	return nil, nil
}

func operationsImport(session *sessions.Session, arg struct {
	Account string
	Content string
}) (int, error) {
	count, err := business.OperationsImport(arg.Account, arg.Content)
	if err != nil {
		return 0, err
	}

	_, err = business.ExecuteRules()
	if err != nil {
		return 0, err
	}

	return count, nil
}

func operationsExecuteRules(session *sessions.Session, arg struct{}) (int, error) {
	return business.ExecuteRules()
}

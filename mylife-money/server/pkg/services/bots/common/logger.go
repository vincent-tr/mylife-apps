package common

import (
	"fmt"
	"mylife-money/pkg/business/views"
	"mylife-money/pkg/entities"
	"mylife-tools/log"
	"mylife-tools/services/tasks"
)

var logger = log.CreateLogger("mylife:money:bots")

type ExecutionLogger struct {
	typ         entities.BotType
	maxSeverity entities.BotRunLogSeverity
}

func NewExecutionLogger(typ entities.BotType) *ExecutionLogger {
	return &ExecutionLogger{
		typ:         typ,
		maxSeverity: entities.BotRunLogSeverityDebug,
	}
}

func (el *ExecutionLogger) Log(message string, severity entities.BotRunLogSeverity) {
	switch severity {
	case entities.BotRunLogSeverityDebug:
		logger.WithField("bot", el.typ).Debug(message)
	case entities.BotRunLogSeverityInfo:
		logger.WithField("bot", el.typ).Info(message)
	case entities.BotRunLogSeverityWarning:
		logger.WithField("bot", el.typ).Warning(message)
	case entities.BotRunLogSeverityError, entities.BotRunLogSeverityFatal:
		// logging fatal events stop the program.
		logger.WithField("bot", el.typ).Error(message)
	}

	tasks.SubmitEventLoop("bots/log", func() {
		views.BotRunLog(el.typ, severity, message)
	})

	if severityOrder[severity] > severityOrder[el.maxSeverity] {
		el.maxSeverity = severity
	}
}

func (el *ExecutionLogger) GetMaxSeverity() entities.BotRunLogSeverity {
	return el.maxSeverity
}

var severityOrder = map[entities.BotRunLogSeverity]int{
	entities.BotRunLogSeverityDebug:   0,
	entities.BotRunLogSeverityInfo:    1,
	entities.BotRunLogSeverityWarning: 2,
	entities.BotRunLogSeverityError:   3,
	entities.BotRunLogSeverityFatal:   4,
}

func (el *ExecutionLogger) Debug(message string) {
	el.Log(message, entities.BotRunLogSeverityDebug)
}

func (el *ExecutionLogger) Debugf(format string, args ...interface{}) {
	el.Debug(fmt.Sprintf(format, args...))
}

func (el *ExecutionLogger) Info(message string) {
	el.Log(message, entities.BotRunLogSeverityInfo)
}

func (el *ExecutionLogger) Infof(format string, args ...interface{}) {
	el.Info(fmt.Sprintf(format, args...))
}

func (el *ExecutionLogger) Warning(message string) {
	el.Log(message, entities.BotRunLogSeverityWarning)
}

func (el *ExecutionLogger) Warningf(format string, args ...interface{}) {
	el.Warning(fmt.Sprintf(format, args...))
}

func (el *ExecutionLogger) Error(message string) {
	el.Log(message, entities.BotRunLogSeverityError)
}

func (el *ExecutionLogger) Errorf(format string, args ...interface{}) {
	el.Error(fmt.Sprintf(format, args...))
}

func (el *ExecutionLogger) Fatal(message string) {
	el.Log(message, entities.BotRunLogSeverityFatal)
}

func (el *ExecutionLogger) Fatalf(format string, args ...interface{}) {
	el.Fatal(fmt.Sprintf(format, args...))
}

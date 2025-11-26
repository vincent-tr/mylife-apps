package notification

import (
	"fmt"
	"mylife-tools/log"
	"mylife-tools/services/sessions"
	"mylife-tools/services/store"
	"mylife-tools/utils"
)

type notificationSession struct {
	session    *sessions.Session
	idGen      utils.IdGenerator
	publishers map[uint64]iviewPublisher
}

func newNotificationSession(session *sessions.Session) *notificationSession {
	return &notificationSession{
		session:    session,
		idGen:      utils.NewIdGenerator(),
		publishers: make(map[uint64]iviewPublisher),
	}
}

func (notificationSession *notificationSession) Close() {
	for viewId := range notificationSession.publishers {
		notificationSession.closeView(viewId)
	}
}

// Cannot use generics as member functions
func registerView[TEntity store.Entity](session *notificationSession, view store.IContainer[TEntity]) uint64 {
	viewId := session.idGen.Next()
	publisher := newViewPublisher[TEntity](session.session, viewId, view)

	session.publishers[viewId] = publisher

	logger.WithFields(log.Fields{"viewId": viewId, "sessionId": session.session.Id()}).Debug("View registered")

	return viewId
}

func (session *notificationSession) closeView(viewId uint64) {
	publisher, exists := session.publishers[viewId]

	if !exists {
		logger.WithFields(log.Fields{"viewId": viewId, "sessionId": session.session.Id()}).Error("Cannot remove unknown view")
		return
	}

	publisher.close()
	delete(session.publishers, viewId)

	logger.WithFields(log.Fields{"viewId": viewId, "sessionId": session.session.Id()}).Debug("View unregistered")
}

func (session *notificationSession) getView(viewId uint64) (any, error) {
	publisher, exists := session.publishers[viewId]

	if !exists {
		return nil, fmt.Errorf("Cannot get unknown view: %d", viewId)
	}

	return publisher.getView(), nil
}

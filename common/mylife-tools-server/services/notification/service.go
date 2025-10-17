package notification

import (
	"fmt"
	"mylife-tools-server/log"
	"mylife-tools-server/services"
	"mylife-tools-server/services/sessions"
	"mylife-tools-server/services/store"
)

var logger = log.CreateLogger("mylife:server:notification")

func init() {
	services.Register(&notificationService{})
}

type notificationService struct {
}

func (service *notificationService) Init(arg interface{}) error {
	return nil
}

func (service *notificationService) Terminate() error {
	return nil
}

func (service *notificationService) ServiceName() string {
	return "notification"
}

func (service *notificationService) Dependencies() []string {
	return []string{"sessions", "io", "tasks"}
}

func (service *notificationService) getNotifications(session *sessions.Session) *notificationSession {
	if existing := session.FindStateObject("notification"); existing != nil {
		return existing.(*notificationSession)
	} else {
		notificationSession := newNotificationSession(session)
		session.RegisterStateObject("notification", notificationSession)
		return notificationSession
	}
}

func getService() *notificationService {
	return services.GetService[*notificationService]("notification")
}

// Public access

func NotifyView[TEntity store.Entity](session *sessions.Session, view store.IContainer[TEntity]) uint64 {
	notificationSession := getService().getNotifications(session)
	return registerView(notificationSession, view)
}

func UnnotifyView(session *sessions.Session, viewId uint64) {
	notificationSession := getService().getNotifications(session)
	notificationSession.closeView(viewId)
}

func GetUntypedView(session *sessions.Session, viewId uint64) (any, error) {
	notificationSession := getService().getNotifications(session)
	return notificationSession.getView(viewId)
}

func GetView[TEntity store.Entity](session *sessions.Session, viewId uint64) (store.IContainer[store.Entity], error) {
	view, err := GetUntypedView(session, viewId)
	if err != nil {
		return nil, err
	}

	if typedView, ok := view.(store.IContainer[store.Entity]); ok {
		return typedView, nil
	}

	return nil, fmt.Errorf("Invalid view type")
}

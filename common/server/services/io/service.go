package io

import (
	"context"
	"mylife-tools/log"
	"mylife-tools/services"
	"mylife-tools/services/sessions"
	"net/http"
	"strings"

	socketio "github.com/vchitai/go-socket.io/v4"
)

var logger = log.CreateLogger("mylife:server:io")

type contextKey string

const ioSessionKey contextKey = "ioSession"

func init() {
	services.Register(&ioService{})
}

type ioService struct {
	server *socketio.Server
}

func (service *ioService) Init(arg interface{}) error {
	service.server = socketio.NewServer(nil)

	service.server.OnConnect("/", func(socket socketio.Conn, dispatchData map[string]interface{}) error {
		session := sessions.NewSession()
		ioSession := newIoSession(session, socket)
		session.RegisterStateObject("io", ioSession)
		socket.SetContext(context.WithValue(context.TODO(), ioSessionKey, ioSession))

		logger.WithFields(log.Fields{"sessionId": ioSession.session.Id(), "socketId": socket.ID()}).Debug("New IO session")

		return nil
	})

	service.server.OnEvent("/", "message", func(socket socketio.Conn, data map[string]interface{}) {
		ioSession := getIoSession(socket)

		if ioSession == nil {
			logger.WithField("socketId", socket.ID()).Error("Got message but could not get associoated session")
			return
		}

		ioSession.dispatch(data)
	})

	service.server.OnError("/", func(socket socketio.Conn, err error) {
		ioSession := getIoSession(socket)

		fields := log.Fields{}
		if socket != nil {
			fields["socketId"] = socket.ID()
		}

		if ioSession != nil {
			fields["sessionId"] = ioSession.session.Id()
		}

		// Special case for normal socketio disconnection (browser going away from page)
		if strings.Contains(err.Error(), "1001") {
			logger.WithError(err).WithFields(fields).Debug("Got error 1001 (going away) on socket")
			return
		}

		// Special case when we try to send data after socket is closed
		if strings.Contains(err.Error(), "close sent") {
			logger.WithError(err).WithFields(fields).Debug("Got error on socket (trying to send data after close)")
			return
		}

		logger.WithError(err).WithFields(fields).Error("Got error on socket")
	})

	service.server.OnDisconnect("/", func(socket socketio.Conn, reason string, dispatchData map[string]interface{}) {
		ioSession := getIoSession(socket)

		if ioSession == nil {
			logger.WithField("socketId", socket.ID()).Error("Got socket disconnection but could not get associoated session")
			return
		}

		logger.WithField("sessionId", ioSession.session.Id()).Debug("IO session disconnected")

		sessions.CloseSession(ioSession.session)
	})

	go func() {
		if err := service.server.Serve(); err != nil {
			logger.WithError(err).Error("socketio listen error")
		}
	}()

	return nil
}

func (service *ioService) Terminate() error {
	return service.server.Close()
}

func (service *ioService) ServiceName() string {
	return "io"
}

func (service *ioService) Dependencies() []string {
	return []string{"api", "sessions", "tasks"}
}

func getIoSession(socket socketio.Conn) *ioSession {
	if socket == nil {
		return nil
	}

	ios, ok := socket.Context().Value(ioSessionKey).(*ioSession)
	if ok {
		return ios
	} else {
		return nil
	}
}

func getService() *ioService {
	return services.GetService[*ioService]("io")
}

// Public access

func GetHandler() http.Handler {
	return getService().server
}

func NotifySession(session sessions.Session, notification any) {
	ios := session.GetStateObject("io").(*ioSession)
	ios.notify(notification)
}

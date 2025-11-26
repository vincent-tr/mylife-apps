package store

import "mylife-tools/services/io/serialization"

type Entity interface {
	serialization.Marshaller
	Id() string
}

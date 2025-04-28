package views

import (
	"mylife-tools-server/services/store"
)

var ViewsDef = []interface{}{
	store.MakeMaterializedViewBuilder("operation-stats", NewOperationStats),
}

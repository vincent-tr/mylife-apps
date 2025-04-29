package business

import (
	"mylife-money/pkg/business/views"
	"mylife-money/pkg/entities"
	"mylife-tools-server/services/store"
)

var StoreDef = []interface{}{
	store.MakeCollectionBuilder("accounts", "accounts", entities.AccountDecode, entities.AccountEncode),
	store.MakeCollectionBuilder("groups", "groups", entities.GroupDecode, entities.GroupEncode),
	store.MakeCollectionBuilder("operations", "operations", entities.OperationDecode, entities.OperationEncode, store.MakePartitionIndexBuilder("partition-by-month", operationToMonth)),
	store.MakeCollectionBuilder("bots", "bots", entities.BotDecode, entities.BotEncode),
	store.MakeCollectionBuilder("bot-runs", "bot-runs", entities.BotRunDecode, entities.BotRunEncode),
	store.MakeMaterializedViewBuilder("operation-stats", views.NewOperationStats),
	store.MakeMaterializedViewBuilder("total-by-month", views.NewTotalByMonth),
}

func operationToMonth(operation *entities.Operation) string {
	return views.DateToMonth(operation.Date())
}

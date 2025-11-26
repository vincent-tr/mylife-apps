package database

import (
	"context"
	"net/url"

	"mylife-tools/config"
	"mylife-tools/log"
	"mylife-tools/services"

	"go.mongodb.org/mongo-driver/v2/bson"
	mongo "go.mongodb.org/mongo-driver/v2/mongo"
	options "go.mongodb.org/mongo-driver/v2/mongo/options"
)

var logger = log.CreateLogger("mylife:server:database")

func init() {
	services.Register(&databaseService{})
}

type Collection = mongo.Collection

type databaseService struct {
	client   *mongo.Client
	database *mongo.Database
	session  *mongo.Session
}

func (service *databaseService) Init(arg interface{}) error {
	mongoUrl := config.GetString("mongo")

	parsedUrl, err := url.Parse(mongoUrl)
	if err != nil {
		return err
	}
	dbName := parsedUrl.Path[1:]

	logger.WithFields(log.Fields{"mongoUrl": mongoUrl, "dbName": dbName}).Info("Config")

	opts := options.Client().ApplyURI(mongoUrl).SetDirect(true)
	client, err := mongo.Connect(opts)
	if err != nil {
		return err
	}

	session, err := client.StartSession()
	if err != nil {
		return err
	}

	service.client = client
	service.database = client.Database(dbName)
	service.session = session

	return nil
}

func (service *databaseService) Terminate() error {
	service.session.EndSession(context.TODO())
	return service.client.Disconnect(context.TODO())
}

func (service *databaseService) ServiceName() string {
	return "database"
}

func (service *databaseService) Dependencies() []string {
	return []string{}
}

func (service *databaseService) getCollection(name string) *Collection {
	return service.database.Collection(name)
}

func (service *databaseService) sessionId() bson.Raw {
	return service.session.ID()
}

func (service *databaseService) withTransaction(callback func() (interface{}, error)) (interface{}, error) {
	return service.session.WithTransaction(context.TODO(), func(ctx context.Context) (interface{}, error) {
		return callback()
	})
}

func getService() *databaseService {
	return services.GetService[*databaseService]("database")
}

// Public access

func GetCollection(name string) *Collection {
	return getService().getCollection(name)
}

func MakeId() string {
	return bson.NewObjectID().Hex()
}

func EncodeId(value string) (bson.ObjectID, error) {
	return bson.ObjectIDFromHex(value)
}

func DecodeId(value bson.ObjectID) string {
	return value.Hex()
}

func SessionId() bson.Raw {
	return getService().sessionId()
}

func WithTransaction(callback func() (interface{}, error)) (interface{}, error) {
	return getService().withTransaction(callback)
}

package entities

import "go.mongodb.org/mongo-driver/v2/bson"

func nullableStringToObjectId(value *string) (*bson.ObjectID, error) {
	if value == nil {
		return nil, nil
	}
	id, err := bson.ObjectIDFromHex(*value)
	if err != nil {
		return nil, err
	}
	return &id, err
}

func nullableObjectIdToString(value *bson.ObjectID) *string {
	if value == nil {
		return nil
	}
	id := value.Hex()
	return &id
}

package query

import "go.mongodb.org/mongo-driver/bson"

type FilterExpression struct {
	value bson.D
}

func makeFilterExpression(operator string, argument any) FilterExpression {
	return FilterExpression{
		value: bson.D{{Key: operator, Value: argument}},
	}
}

func (expression FilterExpression) Build() interface{} {
	return expression.value
}

func Eq(field string, value any) FilterExpression {
	return makeFilterExpression("$eq", bson.D{{Key: field, Value: value}})
}

func Gt(field string, value any) FilterExpression {
	return makeFilterExpression("$gt", bson.D{{Key: field, Value: value}})
}

func Gte(field string, value any) FilterExpression {
	return makeFilterExpression("$gte", bson.D{{Key: field, Value: value}})
}

func Lt(field string, value any) FilterExpression {
	return makeFilterExpression("$lt", bson.D{{Key: field, Value: value}})
}

func Lte(field string, value any) FilterExpression {
	return makeFilterExpression("$lte", bson.D{{Key: field, Value: value}})
}

func And(items ...FilterExpression) FilterExpression {
	argument := bson.A{}

	for _, item := range items {
		argument = append(argument, item.value)
	}

	return makeFilterExpression("$and", argument)
}

func Or(items ...FilterExpression) FilterExpression {
	argument := bson.A{}

	for _, item := range items {
		argument = append(argument, item.value)
	}

	return makeFilterExpression("$or", argument)
}

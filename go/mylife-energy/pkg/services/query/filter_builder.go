package query

import "go.mongodb.org/mongo-driver/bson"

type FilterExpression struct {
	value bson.D
}

func makeUnaryFilterExpression(operator string, argument any) FilterExpression {
	return FilterExpression{
		value: bson.D{{Key: operator, Value: argument}},
	}
}

func makeBinaryFilterExpression(field string, operator string, value any) FilterExpression {
	return FilterExpression{
		value: bson.D{{Key: field, Value: bson.D{{Key: operator, Value: value}}}},
	}
}

func (expression FilterExpression) Build() interface{} {
	return expression.value
}

func Eq(field string, value any) FilterExpression {
	return makeBinaryFilterExpression(field, "$eq", value)
}

func In(field string, values ...any) FilterExpression {
	argument := bson.A{}

	for _, value := range values {
		argument = append(argument, value)
	}

	return makeBinaryFilterExpression(field, "$in", argument)
}

func Gt(field string, value any) FilterExpression {
	return makeBinaryFilterExpression(field, "$gt", value)
}

func Gte(field string, value any) FilterExpression {
	return makeBinaryFilterExpression(field, "$gte", value)
}

func Lt(field string, value any) FilterExpression {
	return makeBinaryFilterExpression(field, "$lt", value)
}

func Lte(field string, value any) FilterExpression {
	return makeBinaryFilterExpression(field, "$lte", value)
}

func And(items ...FilterExpression) FilterExpression {
	argument := bson.A{}

	for _, item := range items {
		argument = append(argument, item.value)
	}

	return makeUnaryFilterExpression("$and", argument)
}

func Or(items ...FilterExpression) FilterExpression {
	argument := bson.A{}

	for _, item := range items {
		argument = append(argument, item.value)
	}

	return makeUnaryFilterExpression("$or", argument)
}

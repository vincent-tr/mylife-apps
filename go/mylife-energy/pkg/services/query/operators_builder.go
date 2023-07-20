package query

import "go.mongodb.org/mongo-driver/bson"

func unaryOperator(operator string, operand any) bson.D {
	return bson.D{{Key: "$" + operator, Value: operand}}
}

func binaryOperator(operator string, operand1 any, operand2 any) bson.D {
	return bson.D{{Key: "$" + operator, Value: bson.A{operand1, operand2}}}
}

func ToDate(operand any) bson.D {
	return unaryOperator("toDate", operand)
}

func ToLong(operand any) bson.D {
	return unaryOperator("toLong", operand)
}

func Year(operand any) bson.D {
	return unaryOperator("year", operand)
}

func Month(operand any) bson.D {
	return unaryOperator("month", operand)
}

func DayOfMonth(operand any) bson.D {
	return unaryOperator("dayOfMonth", operand)
}

type DatePart struct {
	Name       string
	Expression any
}

func DateFromParts(parts ...DatePart) bson.D {
	value := bson.D{}

	for _, part := range parts {
		value = append(value, bson.E{Key: part.Name, Value: part.Expression})
	}

	return unaryOperator("dateFromParts", value)
}

func Substract(operand1 any, operand2 any) bson.D {
	return binaryOperator("subtract", operand1, operand2)
}

func Mod(operand1 any, operand2 any) bson.D {
	return binaryOperator("mod", operand1, operand2)
}

func Divide(operand1 any, operand2 any) bson.D {
	return binaryOperator("divide", operand1, operand2)
}

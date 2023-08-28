package query

import (
	"fmt"

	"github.com/thlib/go-timezone-local/tzlocal"
	"go.mongodb.org/mongo-driver/bson"
)

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

var localTZ string

func init() {
	tz, err := tzlocal.RuntimeTZ()
	if err != nil {
		panic(err)
	}

	localTZ = tz
}

func YearLocal(operand any) bson.D {
	return unaryOperator("year", bson.D{
		bson.E{Key: "date", Value: operand},
		bson.E{Key: "timezone", Value: localTZ},
	})
}

func MonthLocal(operand any) bson.D {
	return unaryOperator("month", bson.D{
		bson.E{Key: "date", Value: operand},
		bson.E{Key: "timezone", Value: localTZ},
	})
}

func DayOfMonthLocal(operand any) bson.D {
	return unaryOperator("dayOfMonth", bson.D{
		bson.E{Key: "date", Value: operand},
		bson.E{Key: "timezone", Value: localTZ},
	})
}

func DateFromPartsLocal(parts ...DatePart) bson.D {
	value := bson.D{}

	for _, part := range parts {
		value = append(value, bson.E{Key: part.Name, Value: part.Expression})
	}

	value = append(value, bson.E{Key: "timezone", Value: "+06"})

	fmt.Printf("%+v\n", value)

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

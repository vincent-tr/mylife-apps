package query

import "go.mongodb.org/mongo-driver/v2/bson"

type PipelineBuilder struct {
	stages []bson.D
}

func NewPipelineBuilder() *PipelineBuilder {
	return &PipelineBuilder{
		stages: make([]bson.D, 0),
	}
}

func (builder *PipelineBuilder) Build() interface{} {
	return builder.stages
}

func (builder *PipelineBuilder) addStage(name string, value interface{}) *PipelineBuilder {
	stage := bson.D{{Key: name, Value: value}}
	builder.stages = append(builder.stages, stage)

	return builder
}

type SortOrder int

const (
	Asc  SortOrder = 1
	Desc SortOrder = -1
)

type SortField struct {
	Name  string
	Order SortOrder
}

func (builder *PipelineBuilder) Sort(fields ...SortField) *PipelineBuilder {
	value := bson.D{}

	for _, item := range fields {
		value = append(value, bson.E{Key: item.Name, Value: int(item.Order)})
	}

	return builder.addStage("$sort", value)
}

type GroupField struct {
	Name        string
	Accumulator string
	Expression  any
}

func (builder *PipelineBuilder) Group(groupKeyExpression any, fields ...GroupField) *PipelineBuilder {
	value := bson.D{
		{Key: "_id", Value: groupKeyExpression},
	}

	for _, item := range fields {
		value = append(value, bson.E{Key: item.Name, Value: bson.D{{Key: item.Accumulator, Value: item.Expression}}})
	}

	return builder.addStage("$group", value)
}

func (builder *PipelineBuilder) Match(filter FilterExpression) *PipelineBuilder {
	return builder.addStage("$match", filter.Build().(bson.D))
}

type SetField struct {
	Name       string
	Expression any
}

func (builder *PipelineBuilder) Set(fields ...SetField) *PipelineBuilder {
	value := bson.D{}

	for _, item := range fields {
		value = append(value, bson.E{Key: item.Name, Value: item.Expression})
	}

	return builder.addStage("$set", value)
}

func (builder *PipelineBuilder) Unset(fields ...string) *PipelineBuilder {
	value := bson.A{}

	for _, item := range fields {
		value = append(value, item)
	}

	return builder.addStage("$unset", value)
}

package store

import "mylife-tools-server/services/database"

type CollectionBuilder[TEntity Entity] struct {
	colName     string
	dataColName string
	decoder     func(raw []byte) (TEntity, error)
	encoder     func(obj TEntity) ([]byte, error)
	indexes     []IndexBuilder[TEntity]
}

type icollectionBuilder interface {
	name() string
	build() genericInternalCollection
}

func MakeCollectionBuilder[TEntity Entity](
	colName string,
	dataColName string,
	decoder func(raw []byte) (TEntity, error),
	encoder func(obj TEntity) ([]byte, error),
	indexes ...IndexBuilder[TEntity],
) *CollectionBuilder[TEntity] {
	return &CollectionBuilder[TEntity]{
		colName:     colName,
		dataColName: dataColName,
		decoder:     decoder,
		encoder:     encoder,
		indexes:     indexes,
	}
}

func (builder *CollectionBuilder[TEntity]) name() string {
	return builder.colName
}

func (builder *CollectionBuilder[TEntity]) build() genericInternalCollection {
	col := &collection[TEntity]{
		container: NewContainer[TEntity](builder.colName),
	}

	for _, index := range builder.indexes {
		indexName := index.name()

		if _, exists := col.indexes[indexName]; exists {
			panic("Duplicate index name: " + indexName)
		}

		col.indexes[indexName] = index.build(col)
	}

	dataCol := database.GetCollection(builder.dataColName)
	col.updater = makeUpdater(col, dataCol, builder.decoder, builder.encoder)

	return col
}

type IndexBuilder[TEntity Entity] interface {
	name() string
	build(col ICollection[TEntity]) ICollectionIndex[TEntity]
}

type PartitionIndexBuilder[TEntity Entity, TPartitionKey comparable] struct {
	indexName  string
	keyBuilder func(obj TEntity) TPartitionKey
}

func MakePartitionIndexBuilder[TEntity Entity, TPartitionKey comparable](
	name string,
	keyBuilder func(obj TEntity) TPartitionKey,
) *PartitionIndexBuilder[TEntity, TPartitionKey] {
	return &PartitionIndexBuilder[TEntity, TPartitionKey]{indexName: name, keyBuilder: keyBuilder}
}

func (builder *PartitionIndexBuilder[TEntity, TPartitionKey]) name() string {
	return builder.indexName
}

func (builder *PartitionIndexBuilder[TEntity, TPartitionKey]) build(col ICollection[TEntity]) ICollectionIndex[TEntity] {
	return makePartitionIndex(col, builder.keyBuilder)
}

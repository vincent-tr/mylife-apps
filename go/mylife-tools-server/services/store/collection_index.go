package store

type ICollectionIndex[TEntity Entity] interface {
}

type IPartitionIndex[TEntity Entity, TPartitionKey comparable] interface {
	ICollectionIndex[TEntity]

	// Caller must not modify the returned map
	// Return nil if no such key exists
	FindPartition(key TPartitionKey) map[string]TEntity
}

type partitionIndex[TEntity Entity, TPartitionKey comparable] struct {
	collection ICollection[TEntity]
	buildKey   func(obj TEntity) TPartitionKey
	partitions map[TPartitionKey]map[string]TEntity
}

func makePartitionIndex[TEntity Entity, TPartitionKey comparable](collection ICollection[TEntity], keyBuilder func(obj TEntity) TPartitionKey) IPartitionIndex[TEntity, TPartitionKey] {
	index := &partitionIndex[TEntity, TPartitionKey]{
		collection: collection,
		buildKey:   keyBuilder,
		partitions: make(map[TPartitionKey]map[string]TEntity),
	}

	changeCallback := index.onCollectionChange
	index.collection.AddListener(&changeCallback)

	for _, obj := range index.collection.List() {
		index.onCollectionChange(&Event[TEntity]{
			typ:   Create,
			after: obj,
		})
	}

	return index
}

func (index *partitionIndex[TEntity, TPartitionKey]) onCollectionChange(event *Event[TEntity]) {
	switch event.Type() {
	case Create:
		index.addToPartition(event.After())
	case Update:
		index.removeFromPartition(event.Before())
		index.addToPartition(event.After())
	case Remove:
		index.removeFromPartition(event.Before())
	}
}

func (index *partitionIndex[TEntity, TPartitionKey]) addToPartition(object TEntity) {
	key := index.buildKey(object)

	partition, ok := index.partitions[key]
	if !ok {
		partition = make(map[string]TEntity)
		index.partitions[key] = partition
	}

	partition[object.Id()] = object
}

func (index *partitionIndex[TEntity, TPartitionKey]) removeFromPartition(object TEntity) {
	key := index.buildKey(object)

	partition := index.partitions[key]
	delete(partition, object.Id())

	if len(partition) == 0 {
		delete(index.partitions, key)
	}
}

func (index *partitionIndex[TEntity, TPartitionKey]) FindPartition(key TPartitionKey) map[string]TEntity {
	return index.partitions[key]
}

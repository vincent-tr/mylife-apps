package entities

import "mylife-tools/services/store"

var StoreDef = []interface{}{
	store.MakeCollectionBuilder[*Section]("sections", "sections", sectionDecode, sectionEncode),
	store.MakeCollectionBuilder[*Item]("items", "items", itemDecode, itemEncode),
}

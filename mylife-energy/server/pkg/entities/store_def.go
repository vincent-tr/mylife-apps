package entities

import "mylife-tools/services/store"

var StoreDef = []interface{}{
	store.MakeCollectionBuilder[*Device]("devices", "devices", deviceDecode, deviceEncode),
}

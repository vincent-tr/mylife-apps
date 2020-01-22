'use strict';

// https://redux.js.org/recipes/structuring-reducers/immutable-update-patterns
// https://github.com/sindresorhus/array-move/blob/master/index.js

exports.immutable = {
  arrayPush: (array, value) => [...array, value],
  arrayRemove: (array, index) => [...array.slice(0, index), ...array.slice(index + 1)],
  arrayUpdate: (array, index, value) => array.map((item, mapIndex) => mapIndex === index ? value : item),
  arrayMove: (array, oldIndex, newIndex) => arrayMoveMutate(array.slice(), oldIndex, newIndex)
};

function arrayMoveMutate(array, from, to) {
	const startIndex = to < 0 ? array.length + to : to;
	const item = array.splice(from, 1)[0];
	array.splice(startIndex, 0, item);
  return array;
}

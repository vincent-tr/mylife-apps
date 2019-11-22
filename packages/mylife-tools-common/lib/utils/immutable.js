'use strict';

// https://redux.js.org/recipes/structuring-reducers/immutable-update-patterns

exports.immutable = {
  arrayPush: (array, index, value) => [...array, value],
  arrayRemove: (array, index) => [...array.slice(0, index), ...array.slice(index + 1)],
  arrayUpdate: (array, index, value) => array.map((item, mapIndex) => mapIndex === index ? value : item),
};

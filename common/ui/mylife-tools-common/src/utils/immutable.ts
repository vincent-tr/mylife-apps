'use strict';

// https://redux.js.org/recipes/structuring-reducers/immutable-update-patterns
// https://github.com/sindresorhus/array-move/blob/master/index.js

export function arrayPush<T>(array: T[], value: T) {
  return [...array, value];
}

export function arrayRemove<T>(array: T[], index: number) {
  return [...array.slice(0, index), ...array.slice(index + 1)];
}

export function arrayUpdate<T>(array: T[], index: number, value: T) {
  return array.map((item, mapIndex) => mapIndex === index ? value : item);
}

export function arrayMove<T>(array: T[], oldIndex: number, newIndex: number) {
  return arrayMoveMutate(array.slice(), oldIndex, newIndex);
}

function arrayMoveMutate<T>(array: T[], from: number, to: number) {
  const startIndex = to < 0 ? array.length + to : to;
  const item = array.splice(from, 1)[0];
  array.splice(startIndex, 0, item);
  return array;
}

export function arrayRemoveMulti<T>(array: T[], indexes: number[]) {
  const set = new Set(indexes);
  const result: T[] = [];

  for (const [index, item] of array.entries()) {
    if (!set.has(index)) {
      result.push(item);
    }
  }

  return result;
}

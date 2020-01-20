'use strict';

import { io, createSelector } from 'mylife-tools-ui';

const getBase = state => state.commonPersonView;
export const getViewId = state => getBase(state).viewId;
export const getPersonView = state => io.getView(state, getViewId(state));

export const getPersons = createSelector(
  [ getPersonView ],
  (view) => view.valueSeq().sort(personComparer).toArray()
);

export const getRefCount = state => getBase(state).refCount;

export function personComparer(person1, person2) {
  // sort by first name then last name (ignore case)
  const firstName1 = person1.firstName.toUpperCase();
  const firstName2 = person2.firstName.toUpperCase();

  if(firstName1 !== firstName2) {
    return firstName1 < firstName2 ? -1 : 1;
  }

  const lastName1 = person1.lastName.toUpperCase();
  const lastName2 = person2.lastName.toUpperCase();

  if(lastName1 !== lastName2) {
    return lastName1 < lastName2 ? -1 : 1;
  }

  return person1._id < person2._id ? -1 : 1;
}

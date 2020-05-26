'use strict';

import { io, views } from 'mylife-tools-ui';
import { SELECTOR_VIEW } from './view-ids';

const selectorViewRef = new views.ViewReference({
  uid: SELECTOR_VIEW,
  criteriaSelector: (state, { personId }) => ({ criteria: { persons: [personId] } }),
  service: 'document',
  method: 'notifyDocumentsWithInfo'
});

export const createPerson = (firstName, lastName) => {
  return async (dispatch) => {

    await dispatch(io.call({
      service: 'person',
      method: 'createPerson',
      values: { firstName, lastName }
    }));
  };
};

export const deletePerson = (id) => {
  return async (dispatch) => {

    await dispatch(io.call({
      service: 'person',
      method: 'deletePerson',
      id
    }));
  };
};

export const updatePerson = (person, values) => {
  return async (dispatch) => {

    await dispatch(io.call({
      service: 'person',
      method: 'updatePerson',
      id: person._id,
      values
    }));
  };
};

export const enterSelector = (personId) => async (dispatch) => {
  await selectorViewRef.attach({ personId });
};

export const leaveSelector = () => async (dispatch) => {
  await selectorViewRef.detach();
};

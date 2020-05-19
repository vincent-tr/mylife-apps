'use strict';

import { io, createAction } from 'mylife-tools-ui';
import actionTypes from './action-types';
import { getSelectorViewId } from './selectors';

const local = {
  setSelectorView: createAction(actionTypes.SET_SELECTOR_VIEW),
};

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

export const enterSelector = (personId) => io.createOrUpdateView({
  criteriaSelector: () => ({ criteria: { persons: [personId] } }),
  viewSelector: getSelectorViewId,
  setViewAction: local.setSelectorView,
  service: 'document',
  method: 'notifyDocumentsWithInfo'
});

export const leaveSelector = () => io.deleteView({
  viewSelector: getSelectorViewId,
  setViewAction: local.setSelectorView
});

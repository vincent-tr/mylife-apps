'use strict';

import { createAction, io, dialogs } from 'mylife-tools-ui';
import { actionTypes } from '../constants';
import { getCriteria, getSelectedGroupId, getSelectedOperations, getOperationIds, getOperationViewId } from '../selectors/management';

const local = {
  showSuccess: message => dialogs.notificationShow({ message, type: dialogs.notificationShow.types.success }),
  setOperationView: createAction(actionTypes.MANAGEMENT_SET_OPERATION_VIEW),
  setCriteria: createAction(actionTypes.MANAGEMENT_SET_CRITERIA),
  selectOperations: createAction(actionTypes.MANAGEMENT_SELECT_OPERATIONS)
};

export const managementEnter = getOperations;
export const managementLeave = clearOperations;

export const getOperations = () => async (dispatch, getState) => {
  const state = getState();

  const criteria = getCriteria(state);
  const newViewId = await dispatch(io.call({
    service: 'management',
    method: 'notifyOperations',
    ... criteria
  }));

  const oldViewId = getOperationViewId(state);
  if(oldViewId) {
    await dispatch(io.unnotify(oldViewId));
  }

  dispatch(local.setOperationView(newViewId));
};

export const clearOperations = () => async (dispatch, getState) => {
  const state = getState();
  const oldViewId = getOperationViewId(state);
  if(!oldViewId) {
    return;
  }

  await dispatch(io.unnotify(oldViewId));
  dispatch(local.setOperationView(null));
};

export const setMinDate = (value) => {
  return (dispatch) => {
    dispatch(local.setCriteria({ minDate: value }));
    dispatch(getOperations());
  };
};

export const setMaxDate = (value) => {
  return (dispatch) => {
    dispatch(local.setCriteria({ maxDate: value }));
    dispatch(getOperations());
  };
};

export const setAccount = (value) => {
  return (dispatch) => {
    dispatch(local.setCriteria({ account: value }));
    dispatch(getOperations());
  };
};

export const selectGroup = (id) => {
  return (dispatch) => {
    dispatch(local.setCriteria({ group: id }));
    dispatch(getOperations());
  };
};

let groupIdCount = 0;

export const createGroup = () => {
  return async (dispatch, getState) => {
    const parentGroup = getSelectedGroupId(getState());
    const newGroup = {
      display: `group${++groupIdCount}`,
      parent: parentGroup
    };

    const id = await dispatch(io.call({
      service: 'management',
      method: 'createGroup',
      object: newGroup
    }));

    dispatch(selectGroup(id));
  };
};

export const deleteGroup = () => {
  return async (dispatch, getState) => {
    const id = getSelectedGroupId(getState());

    await dispatch(io.call({
      service: 'management',
      method: 'deleteGroup',
      id
    }));

    dispatch(selectGroup(null));
  };
};

export const updateGroup = (group) => {
  return async (dispatch) => {
    await dispatch(io.call({
      service: 'management',
      method: 'updateGroup',
      object: group
    }));
  };
};

export const moveOperations = (group) => {
  return async (dispatch, getState) => {
    const operations = getSelectedOperations(getState()).map(op => op._id);

    await dispatch(io.call({
      service: 'management',
      method: 'moveOperations',
      group,
      operations
    }));
  };
};

export const operationsSetNote = (note) => {
  return async (dispatch, getState) => {
    const operations = getSelectedOperations(getState()).map(op => op._id);

    await dispatch(io.call({
      service: 'management',
      method: 'operationsSetNote',
      note,
      operations
    }));
  };
};

export const selectOperation = ({ id, selected }) => {
  return (dispatch, getState) => {
    if(id) {
      dispatch(local.selectOperations({ id, selected }));
      return;
    }

    // we are selecting/unselecting all
    if(!selected) {
      dispatch(local.selectOperations({ ids: [] }));
      return;
    }

    const state = getState();
    const ids = getOperationIds(state);
    dispatch(local.selectOperations({ ids }));
  };
};

export const importOperations = (account, file) => {
  return async (dispatch) => {
    const content = await readFile(file);

    const count = await dispatch(io.call({
      service: 'management',
      method: 'operationsImport',
      account,
      content
    }));

    dispatch(local.showSuccess(`${count} operation(s) importée(s)`));
  };
};

export const operationsExecuteRules = () => {
  return async (dispatch) => {
    const count = await dispatch(io.call({
      service: 'management',
      method: 'operationsExecuteRules'
    }));

    dispatch(local.showSuccess(`${count} operation(s) déplacée(s)`));
  };
};

async function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      const err = reader.error;
      if(err) { return reject(err); }
      resolve(reader.result);
    };

    reader.readAsText(file);
  });
}

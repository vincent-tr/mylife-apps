'use strict';

let groupIdCount = 0;

import { createAction, io, dialogs } from 'mylife-tools-ui';
import { actionTypes } from '../constants';
import { getGroupAndChildrenIds } from '../selectors/groups';
import { getFilters, getSelectedGroupId, getSelectedOperations } from '../selectors/management';

const local = {
  showSuccess: message => dialogs.notificationShow({ message, type: dialogs.notificationShow.types.success }),
  selectGroup: createAction(actionTypes.MANAGEMENT_SELECT_GROUP),
  createGroup: createAction(actionTypes.MANAGEMENT_CREATE_GROUP),
  updateGroup: createAction(actionTypes.MANAGEMENT_UPDATE_GROUP),
  deleteGroup: createAction(actionTypes.MANAGEMENT_DELETE_GROUP),
  getOperations: createAction(actionTypes.MANAGEMENT_GET_OPERATIONS),
  moveOperations: createAction(actionTypes.MANAGEMENT_MOVE_OPERATIONS),
  operationsSetNote: createAction(actionTypes.MANAGEMENT_OPERATIONS_SET_NOTE),
  refresh: createAction(actionTypes.MANAGEMENT_REFRESH),
  setMinDate: createAction(actionTypes.MANAGEMENT_SET_MIN_DATE),
  setMaxDate: createAction(actionTypes.MANAGEMENT_SET_MAX_DATE),
  setAccount: createAction(actionTypes.MANAGEMENT_SET_ACCOUNT)
};

const refresh = () => {
  return (dispatch, getState) => {
    const state  = getState();
    const groups = getGroupAndChildrenIds(state, { group: getSelectedGroupId(state) });
    dispatch(local.refresh(groups));
  };
};

export const selectGroup = (id) => {
  return (dispatch) => {
    dispatch(local.selectGroup(id));
    dispatch(refresh());
  };
};

export const createGroup = () => {
  return async (dispatch, getState) => {
    const parentGroup = getSelectedGroupId(getState());
    const newGroup = {
      display: `group${++groupIdCount}`,
      parent: parentGroup
    };

    const data = await dispatch(io.call({
      service: 'management',
      method: 'createGroup',
      object: newGroup
    }));

    dispatch(local.createGroup(data));
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

    dispatch(local.deleteGroup(id));
  };
};

export const updateGroup = (group) => {
  return async (dispatch) => {
    const data = await dispatch(io.call({
      service: 'management',
      method: 'updateGroup',
      object: group
    }));

    dispatch(local.updateGroup(data));
  };
};

export const getOperations = () => {
  return async (dispatch, getState) => {
    const query = getFilters(getState());

    const data = await dispatch(io.call({
      service: 'management',
      method: 'getOperations',
      ... query
    }));

    dispatch(local.getOperations(data));
    dispatch(refresh());
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

    dispatch(local.moveOperations({ group, operations }));
    dispatch(refresh());
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

    dispatch(local.operationsSetNote({ note, operations }));
    dispatch(refresh());
  };
};

export const setMinDate = (value) => {
  return (dispatch) => {
    dispatch(local.setMinDate(value));
    dispatch(getOperations());
  };
};

export const setMaxDate = (value) => {
  return (dispatch) => {
    dispatch(local.setMaxDate(value));
    dispatch(getOperations());
  };
};

export const setAccount = (value) => {
  return (dispatch) => {
    dispatch(local.setAccount(value));
    dispatch(getOperations());
  };
};

export const selectOperation = createAction(actionTypes.MANAGEMENT_SELECT_OPERATIONS);

export const importOperations = (account, file) => {
  return async (dispatch) => {
    const content = await readFile(file);

    const count = await dispatch(io.call({
      service: 'management',
      method: 'operationsImport',
      account,
      content
    }));

    dispatch(getOperations());
    dispatch(local.showSuccess(`${count} operation(s) importée(s)`));
  };
};

export const operationsExecuteRules = () => {
  return async (dispatch) => {
    const count = await dispatch(io.call({
      service: 'management',
      method: 'operationsExecuteRules'
    }));

    dispatch(getOperations());
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

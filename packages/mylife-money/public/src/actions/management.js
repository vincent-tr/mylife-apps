'use strict';

let groupIdCount = 0;

import { createAction, io, dialogs } from 'mylife-tools-ui';
import { actionTypes } from '../constants';
import { getGroupAndChildrenIds } from '../selectors/groups';
import { getSelectedGroupId, getSelectedOperations } from '../selectors/management';

const showSuccess = message => dialogs.notificationShow({ message, type: dialogs.notificationShow.types.success });

const querySelectGroup = createAction(actionTypes.MANAGEMENT_SELECT_GROUP);

export const createGroupData = createAction(actionTypes.MANAGEMENT_CREATE_GROUP);
export const updateGroupData = createAction(actionTypes.MANAGEMENT_UPDATE_GROUP);
export const deleteGroupData = createAction(actionTypes.MANAGEMENT_DELETE_GROUP);

export const selectGroup = (id) => {
  return (dispatch) => {
    dispatch(querySelectGroup(id));
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

    dispatch(createGroupData(data));
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

    dispatch(deleteGroupData(id));
  };
};

export const updateGroup = (group) => {
  return async (dispatch) => {
    const data = await dispatch(io.call({
      service: 'management',
      method: 'updateGroup',
      object: group
    }));

    dispatch(updateGroupData(data));
  };
};

const getOperationsData = createAction(actionTypes.MANAGEMENT_GET_OPERATIONS);
const moveOperationsData = createAction(actionTypes.MANAGEMENT_MOVE_OPERATIONS);
const operationsSetNoteData = createAction(actionTypes.MANAGEMENT_OPERATIONS_SET_NOTE);

export const getOperations = () => {
  return async (dispatch, getState) => {
    const management = getState().management;
    const query = formatOperationsQuery(management);

    const data = await dispatch(io.call({
      service: 'management',
      method: 'getOperations',
      ... query
    }));

    dispatch(getOperationsData(data));
    dispatch(refresh());
  };
};

function formatOperationsQuery({ minDate, maxDate, account }) {
  const query = {};
  if(minDate) {
    query.minDate = minDate.valueOf();
  }
  if(maxDate) {
    query.maxDate = maxDate.valueOf();
  }
  if(account) {
    query.account = account;
  }
  return query;
}

export const moveOperations = (group) => {
  return async (dispatch, getState) => {
    const operations = getSelectedOperations(getState()).map(op => op.id);

    await dispatch(io.call({
      service: 'management',
      method: 'moveOperations',
      group,
      operations
    }));

    dispatch(moveOperationsData({ group, operations }));
    dispatch(refresh());
  };
};

export const operationsSetNote = (note) => {
  return async (dispatch, getState) => {
    const operations = getSelectedOperations(getState()).map(op => op.id);

    await dispatch(io.call({
      service: 'management',
      method: 'operationsSetNote',
      note,
      operations
    }));

    dispatch(operationsSetNoteData({ note, operations }));
    dispatch(refresh());
  };
};

const queryRefresh    = createAction(actionTypes.MANAGEMENT_REFRESH);
const setMinDateData = createAction(actionTypes.MANAGEMENT_SET_MIN_DATE);
const setMaxDateData = createAction(actionTypes.MANAGEMENT_SET_MAX_DATE);
const setAccountData = createAction(actionTypes.MANAGEMENT_SET_ACCOUNT);

export const setMinDate = (value) => {
  return (dispatch) => {
    dispatch(setMinDateData(value));
    dispatch(getOperations());
  };
};

export const setMaxDate = (value) => {
  return (dispatch) => {
    dispatch(setMaxDateData(value));
    dispatch(getOperations());
  };
};

export const setAccount = (value) => {
  return (dispatch) => {
    dispatch(setAccountData(value));
    dispatch(getOperations());
  };
};

export const refresh = () => {
  return (dispatch, getState) => {
    const state  = getState();
    const groups = getGroupAndChildrenIds(state, { group: getSelectedGroupId(state) });
    dispatch(queryRefresh(groups));
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
    dispatch(showSuccess(`${count} operation(s) importée(s)`));
  };
};

export const operationsExecuteRules = () => {
  return async (dispatch) => {
    const count = await dispatch(io.call({
      service: 'management',
      method: 'operationsExecuteRules'
    }));

    dispatch(getOperations());
    dispatch(showSuccess(`${count} operation(s) déplacée(s)`));
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

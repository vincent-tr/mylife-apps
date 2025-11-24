import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Criteria } from './types';
import { dialogs, io } from 'mylife-tools-ui';
import { views } from 'mylife-tools-ui';

type FIXME_any = any;

interface ManagementState {
  criteria: Criteria;
  operations: OperationState;
}

interface OperationState {
  view: string | null;
  selected: string[];
  detail: string | null;
}

interface SelectOperation {
  selected: boolean;
  ids: string[];
}

const initialState: ManagementState = {
  criteria: {
    minDate: new Date(new Date().getFullYear(), 0, 1),
    maxDate: null,
    account: null,
    group: null,
    lookupText: null,
  },
  operations: {
    view: null,
    selected: [], // immutable.Set(),
    detail: null,
  },
};

const managementSlice = createSlice({
  name: 'management',
  initialState,
  reducers: {
    setCriteria(state, action: PayloadAction<Partial<Criteria>>) {
      Object.assign(state.criteria, action.payload);

      // clear selection when criteria changes
      state.operations.selected = [];
    },

    setOperationView(state, action: PayloadAction<string | null>) {
      state.operations.view = action.payload;
      state.operations.selected = [];
    },

    selectOperations(state, action: PayloadAction<SelectOperation>) {
      const { selected, ids } = action.payload;
      if (selected) {
        state.operations.selected = Array.from(new Set([...state.operations.selected, ...ids]));
      } else {
        const idsToRemove = new Set(ids);
        state.operations.selected = state.operations.selected.filter((id) => !idsToRemove.has(id));
      }
    },

    setDetail(state, action: PayloadAction<string | null>) {
      state.operations.detail = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(io.setOnline, (state, action) => {
      if (!action.payload) {
        state.operations.view = null;
        state.operations.selected = [];
        state.operations.detail = null;
      }
    });
  },

  selectors: {
    getOperationViewId: (state) => state.operations.view,
    isOperationDetail: (state) => !!state.operations.detail,
    getOperationIdDetail: (state) => state.operations.detail,
    getSelected: (state) => state.operations.selected,
    getCriteria: (state) => state.criteria,
  },
});

export const { getCriteria, isOperationDetail } = managementSlice.selectors;

export default managementSlice.reducer;

const local = {
  showSuccess: (message) => dialogs.showNotification({ message, type: 'success' }),
  setOperationView: managementSlice.actions.setOperationView,
  setCriteria: managementSlice.actions.setCriteria,
  selectOperations: managementSlice.actions.selectOperations,
  setDetail: managementSlice.actions.setDetail,
  getCriteria: managementSlice.selectors.getCriteria,
  getOperationViewId: managementSlice.selectors.getOperationViewId,
  getOperationIdDetail: managementSlice.selectors.getOperationIdDetail,
  getSelected: managementSlice.selectors.getSelected,
};

const getOperationView = (state) => io.getView(state, local.getOperationViewId(state));
export const getOperationDetail = (state) => getOperationView(state)[local.getOperationIdDetail(state)];

export const getSelectedOperationIds = createSelector([local.getSelected, getOperationView], (selected, view) => selected.filter((id) => id in view));

const getOperationIds = createSelector([getOperationView], (view) => Object.keys(view));

export const getSelectedOperations = createSelector([getSelectedOperationIds, getOperationView], (selectedIds, view) => selectedIds.map((id) => view[id]));

export const getSelectedGroupId = (state) => local.getCriteria(state).group;

export const getSortedOperations = createSelector([getOperationView], (operations) => {
  const ret = Object.values(operations);
  ret.sort((op1, op2) => {
    const comp = (op1 as FIXME_any).date - (op2 as FIXME_any).date;
    if (comp) {
      return comp;
    }
    return op1._id < op2._id ? -1 : 1; // consistency
  });
  return ret;
});

export const getOperations = () =>
  views.createOrUpdateView({
    criteriaSelector: local.getCriteria,
    viewSelector: local.getOperationViewId,
    setViewAction: local.setOperationView,
    service: 'management',
    method: 'notifyOperations',
  });

const clearOperations = () =>
  views.deleteView({
    viewSelector: local.getOperationViewId,
    setViewAction: local.setOperationView,
  });

export const showDetail = (operationId) => local.setDetail(operationId);
export const closeDetail = () => local.setDetail(null);

export const managementEnter = getOperations;
export const managementLeave = createAsyncThunk('management/managementLeave', async (_, api) => {
  await api.dispatch(clearOperations());
  api.dispatch(closeDetail());
});

export const setMinDate = (value) => setCriteriaValue('minDate', value);
export const setMaxDate = (value) => setCriteriaValue('maxDate', value);
export const setAccount = (value) => setCriteriaValue('account', value);
export const setLookupText = (value) => setCriteriaValue('lookupText', value);

export const selectGroup = (value) => (dispatch) => {
  dispatch(setCriteriaValue('group', value));
  dispatch(closeDetail());
};

function setCriteriaValue(name, value) {
  return (dispatch, getState) => {
    const state = getState();
    const criteria = local.getCriteria(state);
    if (criteria[name] === value) {
      return;
    }

    dispatch(local.setCriteria({ [name]: value }));
    dispatch(getOperations());
  };
}

let groupIdCount = 0;

export const createGroup = createAsyncThunk('management/createGroup', async (_, api) => {
  const parentGroup = getSelectedGroupId(api.getState());
  const newGroup = {
    display: `group${++groupIdCount}`,
    parent: parentGroup,
  };

  const id = await api.dispatch(
    io.call({
      service: 'management',
      method: 'createGroup',
      object: newGroup,
    })
  );

  api.dispatch(selectGroup(id));
});

export const deleteGroup = createAsyncThunk('management/deleteGroup', async (_, api) => {
  const id = getSelectedGroupId(api.getState());

  await api.dispatch(
    io.call({
      service: 'management',
      method: 'deleteGroup',
      id,
    })
  );

  api.dispatch(selectGroup(null));
});

export const updateGroup = createAsyncThunk('management/updateGroup', async (group, api) => {
  await api.dispatch(
    io.call({
      service: 'management',
      method: 'updateGroup',
      object: group,
    })
  );
});

export const moveOperations = createAsyncThunk('management/moveOperations', async (group: string, api) => {
  const operations = getSelectedOperations(api.getState()).map((op) => op._id);

  await api.dispatch(
    io.call({
      service: 'management',
      method: 'moveOperations',
      group,
      operations,
    })
  );
});

export const operationMoveDetail = createAsyncThunk('management/operationMoveDetail', async (group: string, api) => {
  const operations = [local.getOperationIdDetail(api.getState() as FIXME_any)];

  api.dispatch(closeDetail());
  await api.dispatch(
    io.call({
      service: 'management',
      method: 'moveOperations',
      group,
      operations,
    })
  );
});

export const operationsSetNote = createAsyncThunk('management/operationsSetNote', async (note: string, api) => {
  const operations = getSelectedOperations(api.getState()).map((op) => op._id);

  await api.dispatch(
    io.call({
      service: 'management',
      method: 'operationsSetNote',
      note,
      operations,
    })
  );
});

export const operationSetNoteDetail = createAsyncThunk('management/operationSetNoteDetail', async (note: string, api) => {
  const operations = [local.getOperationIdDetail(api.getState() as FIXME_any)];

  await api.dispatch(
    io.call({
      service: 'management',
      method: 'operationsSetNote',
      note,
      operations,
    })
  );
});

export const selectOperation = ({ id, selected }) => {
  return (dispatch, getState) => {
    if (id) {
      dispatch(local.selectOperations({ ids: [id], selected }));
      return;
    }

    // we are selecting/unselecting all
    const state = getState();
    const ids = getOperationIds(state);
    dispatch(local.selectOperations({ ids, selected }));
  };
};

export const importOperations = createAsyncThunk('management/importOperations', async ({ account, file }: { account: string; file: File }, api) => {
  const content = await readFile(file);

  const count = await api.dispatch(
    io.call({
      service: 'management',
      method: 'operationsImport',
      account,
      content,
    })
  );

  api.dispatch(local.showSuccess(`${count} operation(s) importée(s)`));
});

export const operationsExecuteRules = createAsyncThunk('management/operationsExecuteRules', async (_, api) => {
  const count = await api.dispatch(
    io.call({
      service: 'management',
      method: 'operationsExecuteRules',
    })
  );

  api.dispatch(local.showSuccess(`${count} operation(s) déplacée(s)`));
});

async function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      const err = reader.error;
      if (err) {
        return reject(err);
      }
      resolve(reader.result);
    };

    reader.readAsText(file);
  });
}

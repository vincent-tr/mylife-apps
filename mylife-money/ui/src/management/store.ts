import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { dialogs, io, views } from 'mylife-tools';
import { Group, Operation } from '../api';
import { createAppAsyncThunk } from '../store';
import { Criteria } from './types';

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
    selected: [],
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

    setOperationViewId(state, action: PayloadAction<string>) {
      state.operations.view = action.payload;
      state.operations.selected = [];
    },

    clearOperationViewId(state) {
      state.operations.view = null;
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

    showDetail(state, action: PayloadAction<string>) {
      state.operations.detail = action.payload;
    },

    closeDetail(state) {
      state.operations.detail = null;
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

export const { getCriteria, getOperationViewId, isOperationDetail } = managementSlice.selectors;
export const { setOperationViewId, clearOperationViewId, showDetail, closeDetail } = managementSlice.actions;

export default managementSlice.reducer;

const local = {
  showSuccess: (message) => dialogs.showNotification({ message, type: 'success' }),
  setCriteria: managementSlice.actions.setCriteria,
  selectOperations: managementSlice.actions.selectOperations,
  getCriteria: managementSlice.selectors.getCriteria,
  getOperationViewId: managementSlice.selectors.getOperationViewId,
  getOperationIdDetail: managementSlice.selectors.getOperationIdDetail,
  getSelected: managementSlice.selectors.getSelected,
};

const getOperationView = (state) => views.getViewById<Operation>(state, local.getOperationViewId(state));
export const getOperationDetail = (state) => getOperationView(state)[local.getOperationIdDetail(state)];

export const getSelectedOperationIds = createSelector([local.getSelected, getOperationView], (selected, view) => selected.filter((id) => id in view));

const getOperationIds = createSelector([getOperationView], (view) => Object.keys(view));

export const getSelectedOperations = createSelector([getSelectedOperationIds, getOperationView], (selectedIds, view) => selectedIds.map((id) => view[id]));

export const getSelectedGroupId = (state) => local.getCriteria(state).group;

export const getSortedOperations = createSelector([getOperationView], (operations) => {
  const ret = Object.values(operations);
  ret.sort((op1, op2) => {
    const comp = op1.date.getTime() - op2.date.getTime();
    if (comp) {
      return comp;
    }
    return op1._id < op2._id ? -1 : 1; // consistency
  });
  return ret;
});

export const setMinDate = (value: Date | null) => setCriteriaValue({ name: 'minDate', value });
export const setMaxDate = (value: Date | null) => setCriteriaValue({ name: 'maxDate', value });
export const setAccount = (value: string | null) => setCriteriaValue({ name: 'account', value });
export const setLookupText = (value: string | null) => setCriteriaValue({ name: 'lookupText', value });

export const selectGroup = createAppAsyncThunk('management/selectGroup', async (value: string | null, api) => {
  api.dispatch(setCriteriaValue({ name: 'group', value }));
  api.dispatch(closeDetail());
});

interface SetCriteriaValuePayload {
  name: keyof Criteria;
  value: unknown;
}

export const setCriteriaValue = createAppAsyncThunk('management/setCriteriaValue', async ({ name, value }: SetCriteriaValuePayload, api) => {
  const state = api.getState();
  const criteria = local.getCriteria(state);
  if (criteria[name] === value) {
    return;
  }

  api.dispatch(local.setCriteria({ [name]: value }));
});

let groupIdCount = 0;

export const createGroup = createAppAsyncThunk('management/createGroup', async (_, api) => {
  const state = api.getState();
  const parentGroup = getSelectedGroupId(state);
  const newGroup = {
    display: `group${++groupIdCount}`,
    parent: parentGroup,
  };

  const id = await api.extra.management.createGroup(newGroup);
  api.dispatch(selectGroup(id));
});

export const deleteGroup = createAppAsyncThunk('management/deleteGroup', async (_, api) => {
  const state = api.getState();
  const id = getSelectedGroupId(state);

  await api.extra.management.deleteGroup(id);
  api.dispatch(selectGroup(null));
});

export const updateGroup = createAppAsyncThunk('management/updateGroup', async (group: Group, api) => {
  await api.extra.management.updateGroup(group);
});

export const moveOperations = createAppAsyncThunk('management/moveOperations', async (group: string, api) => {
  const state = api.getState();
  const operations = getSelectedOperations(state).map((op) => op._id);

  await api.extra.management.moveOperations({ group, operations });
});

export const operationMoveDetail = createAppAsyncThunk('management/operationMoveDetail', async (group: string, api) => {
  const state = api.getState();
  const operations = [local.getOperationIdDetail(state)];

  api.dispatch(closeDetail());
  await api.extra.management.moveOperations({ group, operations });
});

export const operationsSetNote = createAppAsyncThunk('management/operationsSetNote', async (note: string, api) => {
  const state = api.getState();
  const operations = getSelectedOperations(state).map((op) => op._id);

  await api.extra.management.operationsSetNote({ note, operations });
});

export const operationSetNoteDetail = createAppAsyncThunk('management/operationSetNoteDetail', async (note: string, api) => {
  const state = api.getState();
  const operations = [local.getOperationIdDetail(state)];

  await api.extra.management.operationsSetNote({ note, operations });
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

export const importOperations = createAppAsyncThunk('management/importOperations', async ({ account, file }: { account: string; file: File }, api) => {
  const content = await readFile(file);
  const count = await api.extra.management.operationsImport({ account, content });
  api.dispatch(local.showSuccess(`${count} operation(s) importée(s)`));
});

export const operationsExecuteRules = createAppAsyncThunk('management/operationsExecuteRules', async (_, api) => {
  const count = await api.extra.management.operationsExecuteRules();
  api.dispatch(local.showSuccess(`${count} operation(s) déplacée(s)`));
});

async function readFile(file) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      const err = reader.error;
      if (err) {
        return reject(err);
      }
      resolve(reader.result as string);
    };

    reader.readAsText(file);
  });
}

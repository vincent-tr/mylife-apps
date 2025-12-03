import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, dialogs, io, views } from 'mylife-tools';
import { Operation } from '../api';
import { Criteria } from './types';

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

export const selectGroup = createAsyncThunk('management/selectGroup', async (value: string | null, api) => {
  api.dispatch(setCriteriaValue({ name: 'group', value }));
  api.dispatch(closeDetail());
});

interface SetCriteriaValuePayload {
  name: keyof Criteria;
  value: unknown;
}

export const setCriteriaValue = createAsyncThunk('management/setCriteriaValue', async ({ name, value }: SetCriteriaValuePayload, api) => {
  const state = api.getState();
  const criteria = local.getCriteria(state as FIXME_any);
  if (criteria[name] === value) {
    return;
  }

  api.dispatch(local.setCriteria({ [name]: value }));
});

let groupIdCount = 0;

export const createGroup = createAsyncThunk('management/createGroup', async (_, api) => {
  const parentGroup = getSelectedGroupId(api.getState());
  const newGroup = {
    display: `group${++groupIdCount}`,
    parent: parentGroup,
  };

  const id = (await api.extra.call({
    service: 'management',
    method: 'createGroup',
    object: newGroup,
  })) as string;

  api.dispatch(selectGroup(id));
});

export const deleteGroup = createAsyncThunk('management/deleteGroup', async (_, api) => {
  const id = getSelectedGroupId(api.getState());

  await api.extra.call({
    service: 'management',
    method: 'deleteGroup',
    id,
  });

  api.dispatch(selectGroup(null));
});

export const updateGroup = createAsyncThunk('management/updateGroup', async (group, api) => {
  await api.extra.call({
    service: 'management',
    method: 'updateGroup',
    object: group,
  });
});

export const moveOperations = createAsyncThunk('management/moveOperations', async (group: string, api) => {
  const operations = getSelectedOperations(api.getState()).map((op) => op._id);

  await api.extra.call({
    service: 'management',
    method: 'moveOperations',
    group,
    operations,
  });
});

export const operationMoveDetail = createAsyncThunk('management/operationMoveDetail', async (group: string, api) => {
  const operations = [local.getOperationIdDetail(api.getState() as FIXME_any)];

  api.dispatch(closeDetail());
  await api.extra.call({
    service: 'management',
    method: 'moveOperations',
    group,
    operations,
  });
});

export const operationsSetNote = createAsyncThunk('management/operationsSetNote', async (note: string, api) => {
  const operations = getSelectedOperations(api.getState()).map((op) => op._id);

  await api.extra.call({
    service: 'management',
    method: 'operationsSetNote',
    note,
    operations,
  });
});

export const operationSetNoteDetail = createAsyncThunk('management/operationSetNoteDetail', async (note: string, api) => {
  const operations = [local.getOperationIdDetail(api.getState() as FIXME_any)];

  await api.extra.call({
    service: 'management',
    method: 'operationsSetNote',
    note,
    operations,
  });
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

  const count = await api.extra.call({
    service: 'management',
    method: 'operationsImport',
    account,
    content,
  });

  api.dispatch(local.showSuccess(`${count} operation(s) importée(s)`));
});

export const operationsExecuteRules = createAsyncThunk('management/operationsExecuteRules', async (_, api) => {
  const count = await api.extra.call({
    service: 'management',
    method: 'operationsExecuteRules',
  });

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

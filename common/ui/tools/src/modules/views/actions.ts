import { Action } from '@reduxjs/toolkit';
import { Mutex } from 'async-mutex';
//import debounce from 'debounce';
import { STATE_PREFIX } from '../../constants/defines';
import { createAsyncThunk } from '../../services/store-factory';
import * as io from '../io';
import { getViewId, getRefCount, setView, ref, unref } from './store';

type FIXME_any = any;

export interface SharedViewOptions {
  slot: string;
  service: string;
  method: string;
}

export const refSharedView = createAsyncThunk(`${STATE_PREFIX}/views/refSharedView`, async ({ slot, service, method }: SharedViewOptions, api) => {
  const mutex = getSharedViewMutex(slot);

  await mutex.runExclusive(async () => {
    api.dispatch(ref(slot));

    const state = api.getState() as FIXME_any;
    const isAttach = getRefCount(state, slot) === 1;

    if (isAttach) {
      const viewId: string = await api.extra.call({ service, method });
      api.dispatch(setView({ slot, viewId }));
    }
  });
});

export const unrefSharedView = createAsyncThunk(`${STATE_PREFIX}/views/unrefSharedView`, async (slot: string, api) => {
  const mutex = getSharedViewMutex(slot);

  await mutex.runExclusive(async () => {
    api.dispatch(unref(slot));

    const state = api.getState() as FIXME_any;
    const isDetach = getRefCount(state, slot) === 0;

    if (isDetach) {
      const viewId = getViewId(state, slot);
      if (viewId) {
        api.dispatch(setView({ slot, viewId: null }));
        await api.dispatch(io.unnotify(viewId));
      }
    }
  });
});

// Mutex per slot for shared view operations
const sharedViewMutexes = new Map<string, Mutex>();

function getSharedViewMutex(slot: string): Mutex {
  if (!sharedViewMutexes.has(slot)) {
    sharedViewMutexes.set(slot, new Mutex());
  }
  return sharedViewMutexes.get(slot)!;
}

export interface StaticViewOptions {
  slot: string;
  service: string;
  method: string;
}

export const createStaticView = createAsyncThunk(`${STATE_PREFIX}/views/create`, async ({ service, method, slot }: StaticViewOptions, api) => {
  const viewId: string = await api.extra.call({
    service,
    method,
  });

  api.dispatch(setView({ slot, viewId }));
});

interface CreateOrUpdateCriteriaView {
  service: string;
  method: string;
  criteria: unknown;
  viewIdSelector: (state) => string;
  setViewIdAction: (viewId: string) => Action;
  clearViewIdAction: () => Action;
}

export const createOrUpdateCriteriaView = createAsyncThunk(
  `${STATE_PREFIX}/views/createOrUpdateCriteriaView`,
  async ({ service, method, criteria, viewIdSelector, setViewIdAction }: CreateOrUpdateCriteriaView, api) => {
    const state = api.getState();
    const viewId = viewIdSelector(state);

    if (viewId) {
      await api.extra.call({
        service: 'common',
        method: 'renotifyWithCriteria',
        viewId,
        criteria,
      });
    } else {
      const newViewId: string = await api.extra.call({
        service,
        method,
        criteria,
      });

      api.dispatch(setViewIdAction(newViewId));
    }
  }
);

interface DeleteCriteriaView {
  viewIdSelector: (state) => string;
  clearViewIdAction: () => Action;
}

export const deleteCriteriaView = createAsyncThunk(`${STATE_PREFIX}/views/deleteCriteriaView`, async ({ viewIdSelector, clearViewIdAction }: DeleteCriteriaView, api) => {
  const state = api.getState();
  const oldViewId = viewIdSelector(state);
  if (!oldViewId) {
    return;
  }

  api.dispatch(clearViewIdAction());
  await api.dispatch(io.unnotify(oldViewId));
});
/*
interface ViewReferenceOptions {
  slot: string;
  criteriaSelector?;
  service: string;
  method: string;
  canUpdate?: boolean;
}

export class ViewReference {
  public readonly slot: string;
  public readonly criteriaSelector;
  public readonly service: string;
  public readonly method: string;
  public readonly canUpdate: boolean;
  private readonly viewSelector;
  private readonly setViewAction;
  private selectorProps;
  private registering = false;
  private unsubscribe: () => void;

  constructor({ slot, criteriaSelector = () => null, service, method, canUpdate = false }: ViewReferenceOptions) {
    if (!slot) {
      throw new Error('Cannot create ViewReference without slot');
    }
    this.slot = slot;

    this.criteriaSelector = criteriaSelector;
    this.viewSelector = (state) => getViewId(state, slot);
    this.setViewAction = (viewId) => setView({ slot, viewId });
    this.service = service;
    this.method = method;

    this.canUpdate = canUpdate;
  }

  async attach(selectorProps?) {
    this.selectorProps = selectorProps;
    await this.getView();
    this.registering = true;
    this.unsubscribe = observeStore(io.getOnline, (value) => this._onlineChange(value));
    this.registering = false;
  }

  async detach() {
    this.unsubscribe();
    await this.clearView();
  }

  async update(selectorProps?) {
    this.selectorProps = selectorProps;
    await this.getView();
  }

  _onlineChange(value) {
    if (!value || this.registering) {
      return;
    }

    this.getView();
  }

  private async getView() {
    const method = this.canUpdate ? createOrUpdateView : createOrRenewView;
    await this.dispatch(
      method({
        criteriaSelector: this.criteriaSelector,
        selectorProps: this.selectorProps,
        viewSelector: this.viewSelector,
        setViewAction: this.setViewAction,
        service: this.service,
        method: this.method,
      })
    );
  }

  private async clearView() {
    await this.dispatch(
      deleteView({
        viewSelector: this.viewSelector,
        setViewAction: this.setViewAction,
      })
    );
  }

  private dispatch(...args) {
    const store = getStore();
    return store.dispatch(...args);
  }
}

export class SharedViewReference extends ViewReference {
  private readonly refresh: (prevState: number, currentState: number) => void;

  constructor(options: ViewReferenceOptions) {
    super(options);

    this.refresh = createDebouncedRefresh(this.refreshImpl);
  }

  ref() {
    const store = getStore();

    const prevRef = getRefCount(store.getState(), this.slot);
    store.dispatch(ref(this.slot));
    const currentRef = getRefCount(store.getState(), this.slot);
    this.refresh(prevRef, currentRef);
  }

  unref() {
    const store = getStore();

    const prevRef = getRefCount(store.getState(), this.slot);
    store.dispatch(unref(this.slot));
    const currentRef = getRefCount(store.getState(), this.slot);
    this.refresh(prevRef, currentRef);
  }

  private readonly refreshImpl = async (oldRefCount: number, newRefCount: number) => {
    const wasRef = oldRefCount > 0;
    const isRef = newRefCount > 0;
    if (wasRef === isRef) {
      return;
    }

    if (isRef) {
      await this.attach();
    } else {
      await this.detach();
    }
  };
}

// needed  because refresh impl is not atomic
const mutex = new Mutex();

export function createDebouncedRefresh(refresh, timeout = 10) {
  let initRefs: number;
  let finalRefs: number;

  const callRefresh = async () => {
    const local = { initRefs, finalRefs };
    initRefs = finalRefs = undefined;

    await mutex.runExclusive(async () => {
      await refresh(local.initRefs, local.finalRefs);
    });
  };

  const debounced = debounce(callRefresh, timeout);

  return (prevState: number, currentState: number) => {
    if (initRefs === undefined) {
      initRefs = prevState;
    }
    finalRefs = currentState;
    debounced();
  };
}
*/

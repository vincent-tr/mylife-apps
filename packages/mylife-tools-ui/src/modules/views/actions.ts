import { debounce } from 'debounce';
import { Mutex } from 'async-mutex';
import { createAction } from 'redux-actions';
import { observeStore, getStore } from '../../services/store-factory';
import * as io from '../io';
import actionTypes from './action-types';
import { getViewId, getRefCount } from './selectors';

const setView = createAction(actionTypes.SET_VIEW);
const ref = createAction(actionTypes.REF);
const unref = createAction(actionTypes.UNREF);

interface CreateOrUpdateViewOptions {
	criteriaSelector;
	selectorProps?;
	viewSelector;
	setViewAction;
	service;
	method;
}

export function createOrUpdateView({ criteriaSelector, selectorProps, viewSelector, setViewAction, service, method }: CreateOrUpdateViewOptions) {
	return async (dispatch, getState) => {
		const state = getState();

		const criteria = criteriaSelector(state, selectorProps);
		const viewId = viewSelector(state);

		if (viewId) {
			await dispatch(
				io.call({
					service: 'common',
					method: 'renotifyWithCriteria',
					viewId,
					...criteria,
				})
			);

			return;
		}

		const newViewId = await dispatch(
			io.call({
				service,
				method,
				...criteria,
			})
		);

		dispatch(setViewAction(newViewId));
	};
}

// call on views that cannot be updated
export function createOrRenewView({ criteriaSelector, selectorProps, viewSelector, setViewAction, service, method }) {
	return async (dispatch, getState) => {
		const state = getState();

		const oldViewId = viewSelector(state);
		if (oldViewId) {
			dispatch(setViewAction(null));
			await dispatch(io.unnotify(oldViewId));
		}

		const criteria = criteriaSelector(state, selectorProps);
		const newViewId = await dispatch(
			io.call({
				service,
				method,
				...criteria,
			})
		);

		dispatch(setViewAction(newViewId));
	};
}

export function createOrSkipView({ viewSelector, setViewAction, service, method }) {
	return async (dispatch, getState) => {
		const state = getState();

		const viewId = viewSelector(state);

		if (viewId) {
			return;
		}

		const newViewId = await dispatch(
			io.call({
				service,
				method,
				criteria: {},
			})
		);

		dispatch(setViewAction(newViewId));
	};
}

export function deleteView({ viewSelector, setViewAction }) {
	return async (dispatch, getState) => {
		const state = getState();
		const oldViewId = viewSelector(state);
		if (!oldViewId) {
			return;
		}

		dispatch(setViewAction(null));
		await dispatch(io.unnotify(oldViewId));
	};
}

interface ViewReferenceOptions {
	uid: string;
	criteriaSelector?;
	service: string;
	method: string;
	canUpdate?: boolean;
}

export class ViewReference {
	public readonly uid: string;
	private readonly criteriaSelector;
	private readonly viewSelector;
	private readonly setViewAction;
	private readonly service: string;
	private readonly method: string;
	private readonly canUpdate: boolean;
	private selectorProps;
	private registering = false;
	private unsubscribe: () => void;

	constructor({ uid, criteriaSelector = () => null, service, method, canUpdate = false }: ViewReferenceOptions) {
		if (!uid) {
			throw new Error('Cannot create ViewReference without uid');
		}
		this.uid = uid;

		this.criteriaSelector = criteriaSelector;
		this.viewSelector = (state) => getViewId(state, uid);
		this.setViewAction = (viewId) => setView({ uid, viewId });
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

	async update(selectorProps) {
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

    const prevRef = getRefCount(store.getState(), this.uid);
    store.dispatch(ref(this.uid));
    const currentRef = getRefCount(store.getState(), this.uid);
    this.refresh(prevRef, currentRef);
  
  }

  unref() {
    const store = getStore();

    const prevRef = getRefCount(store.getState(), this.uid);
    store.dispatch(unref(this.uid));
    const currentRef = getRefCount(store.getState(), this.uid);
    this.refresh(prevRef, currentRef);
  }

  private readonly refreshImpl = async(oldRefCount: number, newRefCount: number) => {
    const wasRef = oldRefCount > 0;
    const isRef = newRefCount > 0;
    if(wasRef === isRef) {
      return;
    }
  
    if(isRef) {
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
    if(initRefs === undefined) {
      initRefs = prevState;
    }
    finalRefs = currentState;
    debounced();
  };
}

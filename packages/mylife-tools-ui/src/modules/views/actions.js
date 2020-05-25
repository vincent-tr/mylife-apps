'use strict';

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

export function createOrUpdateView({ criteriaSelector, viewSelector, setViewAction, service, method }) {
	return async (dispatch, getState) => {
		const state = getState();

		const criteria = criteriaSelector(state);
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
export function createOrRenewView({ criteriaSelector, viewSelector, setViewAction, service, method }) {
	return async (dispatch, getState) => {
		const state = getState();

		const oldViewId = viewSelector(state);
		if (oldViewId) {
			dispatch(setViewAction(null));
			await dispatch(io.unnotify(oldViewId));
		}

		const criteria = criteriaSelector(state);
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

export class ViewReference {
	constructor({ uid, criteriaSelector = () => null, service, method, canUpdate }) {
		if (!uid) {
			throw new Error('Cannot create ViewReference without uid');
		}
		this.uid = uid;

		this.criteriaSelector = criteriaSelector;
		this.viewSelector = (state) => getViewId(state, uid);
		this.setViewAction = (viewId) => setView({ uid, viewId });
		this.service = service;
		this.method = method;

		this.canUpdate = !!canUpdate;
	}

	async attach() {
		await this._getView();
		this.registering = true;
		this.unsubscribe = observeStore(io.getOnline, (value) => this._onlineChange(value));
		this.registering = false;
	}

	async detach() {
		this.unsubscribe();
		await this._clearView();
	}

	async update() {
		await this._getView();
	}

	_onlineChange(value) {
		if (!value || this.registering) {
			return;
		}

		this._getView();
	}

	async _getView() {
		// TODO: handle createOrSkipView
		const method = this.canUpdate ? createOrUpdateView : createOrRenewView;
		await this._dispatch(
			method({
				criteriaSelector: this.criteriaSelector,
				viewSelector: this.viewSelector,
				setViewAction: this.setViewAction,
				service: this.service,
				method: this.method,
			})
		);
	}

	async _clearView() {
		await this._dispatch(
			deleteView({
				viewSelector: this.viewSelector,
				setViewAction: this.setViewAction,
			})
		);
	}

	_dispatch(...args) {
		const store = getStore();
		return store.dispatch(...args);
	}
}

export class SharedViewReference extends ViewReference {
  constructor(...args) {
    super(...args);

    this._refresh = createDebouncedRefresh((...args) => this._refreshImpl(...args));
  }

  ref() {
    const store = getStore();

    const prevRef = getRefCount(store.getState(), this.uid);
    store.dispatch(ref(this.uid));
    const currentRef = getRefCount(store.getState(), this.uid);
    this._refresh(prevRef, currentRef);
  
  }

  unref() {
    const store = getStore();

    const prevRef = getRefCount(store.getState(), this.uid);
    store.dispatch(unref(this.uid));
    const currentRef = getRefCount(store.getState(), this.uid);
    this._refresh(prevRef, currentRef);
  }

  async _refreshImpl(oldRefCount, newRefCount) {
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
  }
}

// needed  because refresh impl is not atomic
const mutex = new Mutex();

function createDebouncedRefresh(refresh, timeout = 10) {
  let initRefs;
  let finalRefs;

  const callRefresh = async () => {
    const local = { initRefs, finalRefs };
    initRefs = finalRefs = undefined;

    await mutex.runExclusive(async () => {
      await refresh(local.initRefs, local.finalRefs);
    });
  };

  const debounced = debounce(callRefresh, timeout);

  return (prevState, currentState) => {
    if(initRefs === undefined) {
      initRefs = prevState;
    }
    finalRefs = currentState;
    debounced();
  };
}

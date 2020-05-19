'use strict';

// see : https://github.com/supasate/connected-react-router/blob/master/src/actions.js

import { createAction } from 'redux-actions';
import actionTypes from './action-types';
import { getOnline } from './selectors';
import { observeStore, getStore } from '../../services/store-factory';

export const setOnline = createAction(actionTypes.SET_ONLINE);

export const viewChange = createAction(actionTypes.VIEW_CHANGE);
const viewClose = createAction(actionTypes.VIEW_CLOSE);

export const call = createAction(actionTypes.CALL);

export const unnotify = (viewId, service = 'common') => async dispatch => {

  await dispatch(call({
    service,
    method: 'unnotify',
    viewId
  }));

  dispatch(viewClose({ viewId }));
};

// --- view management helpers ---

export function createOrUpdateView({ criteriaSelector, viewSelector, setViewAction, service, method }) {
  return async (dispatch, getState) => {
    const state = getState();

    const criteria = criteriaSelector(state);
    const viewId = viewSelector(state);

    if(viewId) {
      await dispatch(call({
        service: 'common',
        method: 'renotifyWithCriteria',
        viewId,
        ... criteria
      }));

      return;
    }

    const newViewId = await dispatch(call({
      service,
      method,
      ... criteria
    }));

    dispatch(setViewAction(newViewId));
  };
}

// call on views that cannot be updated
export function createOrRenewView({ criteriaSelector, viewSelector, setViewAction, service, method }) {
  return async (dispatch, getState) => {
    const state = getState();

    const oldViewId = viewSelector(state);
    if(oldViewId) {
      dispatch(setViewAction(null));
      await dispatch(unnotify(oldViewId));
    }

    const criteria = criteriaSelector(state);
    const newViewId = await dispatch(call({
      service,
      method,
      ... criteria
    }));

    dispatch(setViewAction(newViewId));
  };
}

export function deleteView({ viewSelector, setViewAction }) {
  return async (dispatch, getState) => {
    const state = getState();
    const oldViewId = viewSelector(state);
    if(!oldViewId) {
      return;
    }

    dispatch(setViewAction(null));
    await dispatch(unnotify(oldViewId));
  };
}

export class ViewReference {
  constructor({ criteriaSelector, viewSelector, setViewAction, service, method, canUpdate }) {
    this.criteriaSelector = criteriaSelector;
    this.viewSelector = viewSelector;
    this.setViewAction = setViewAction;
    this.service = service;
    this.method = method;

    this.canUpdate = !!canUpdate;
  }

  async attach() {
    await this._getView();
    this.registering = true;
    this.unsubscribe = observeStore(getOnline, value => this._onlineChange(value));
    this.registering = false;
  }

  async detach() {
    this.unsubscribe();
    await this._clearView();
  }

  _onlineChange(value) {
    if(!value || this.registering) {
      return;
    }

    this._getView();
  }

  async _getView() {
    const method = this.canUpdate ? createOrUpdateView : createOrRenewView;
    await this._dispatch(method({
      criteriaSelector: this.criteriaSelector,
      viewSelector: this.viewSelector,
      setViewAction: this.setViewAction,
      service: this.service,
      method: this.method
    }));
  }

  async _clearView() {
    await this._dispatch(deleteView({
      viewSelector: this.viewSelector,
      setViewAction: this.setViewAction,
    }));
  }

  _dispatch(...args) {
    const store = getStore();
    return store.dispatch(...args);
  }
}

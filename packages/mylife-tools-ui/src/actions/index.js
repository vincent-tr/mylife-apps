'use strict';

import { services, io } from 'mylife-tools-ui';

export function createOrUpdateView({ criteriaSelector, viewSelector, setViewAction, service, method }) {
  return async (dispatch, getState) => {
    const state = getState();

    const criteria = criteriaSelector(state);
    const viewId = viewSelector(state);

    if(viewId) {
      await dispatch(io.call({
        service: 'common',
        method: 'renotifyWithCriteria',
        viewId,
        ... criteria
      }));

      return;
    }

    const newViewId = await dispatch(io.call({
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
      await dispatch(io.unnotify(oldViewId));
    }

    const criteria = criteriaSelector(state);
    const newViewId = await dispatch(io.call({
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
    await dispatch(io.unnotify(oldViewId));
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
    this.unsubscribe = services.observeStore(io.getOnline, value => this._onlineChange(value));
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
    const store = services.getStore();
    return store.dispatch(...args);
  }
}

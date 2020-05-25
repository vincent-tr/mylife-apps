'use strict';

import { createAction } from 'redux-actions';
import { observeStore, getStore } from '../../services/store-factory';
import * as io from '../io';
import actionTypes from './action-types';
import { getViewReferenceId } from './selectors';

const setViewReference = createAction(actionTypes.SET_VIEW_REFERENCE);

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

		this.criteriaSelector = criteriaSelector;
		this.viewSelector = (state) => getViewReferenceId(state, uid);
		this.setViewAction = (viewId) => setViewReference({ uid, viewId });
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

'use strict';

import { createAction, io } from 'mylife-tools-ui';
import { createOrRenewView, deleteView } from '../common/action-tools';
import actionTypes from './action-types';
import { getDocumentViewId, getKeywordsViewId } from './selectors';

const local = {
  setDocumentView: createAction(actionTypes.SET_DOCUMENT_VIEW),
  setKeywordsView: createAction(actionTypes.SET_KEYWORDS_VIEW),
};

// notifyDocument views cannot be updated (because type can change)
export const fetchDocumentView = (type, id) => createOrRenewView({
  criteriaSelector: () => ({ type, id }),
  viewSelector: getDocumentViewId,
  setViewAction: local.setDocumentView,
  service: 'document',
  method: 'notifyDocument'
});

export const clearDocumentView = () => deleteView({
  viewSelector: getDocumentViewId,
  setViewAction: local.setDocumentView
});

export const fetchKeywordsView = () => createOrRenewView({
  criteriaSelector: () => null,
  viewSelector: getKeywordsViewId,
  setViewAction: local.setKeywordsView,
  service: 'keywords',
  method: 'listKeywords'
});

export const clearKeywordsView = () => deleteView({
  viewSelector: getKeywordsViewId,
  setViewAction: local.setKeywordsView
});

export function updateDocument(document, values) {
  return async (dispatch) => {

    await dispatch(io.call({
      service: 'document',
      method: 'updateDocument',
      type: document._entity,
      id: document._id,
      values
    }));

  };
}

'use strict';

import { io } from 'mylife-tools-ui';

const getDocumentViewer = state => state.documentViewer;
export const getViewId = state => getDocumentViewer(state).viewId;
const getView = state => io.getView(state, getViewId(state));
export const getDocument = state => getView(state).first();

'use strict';

import { io } from 'mylife-tools-ui';

const getDocumentViewer = state => state.documentViewer;

export const getDocumentViewId = state => getDocumentViewer(state).documentViewId;
const getDocumentView = state => io.getView(state, getDocumentViewId(state));
export const getDocument = state => getDocumentView(state).first();

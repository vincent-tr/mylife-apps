'use strict';

import { views } from 'mylife-tools-ui';
import { VIEW } from './view-ids';

const getDocumentViewer = state => state.documentViewer;

export const getCriteria = state => getDocumentViewer(state).criteria;
export const getDocument = state => views.getView(state, VIEW).first();

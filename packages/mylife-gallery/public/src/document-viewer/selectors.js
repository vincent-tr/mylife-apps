'use strict';

import { io } from 'mylife-tools-ui';

export const getDocument = (state, { viewId, documentId }) => io.getView(state, viewId).get(documentId);

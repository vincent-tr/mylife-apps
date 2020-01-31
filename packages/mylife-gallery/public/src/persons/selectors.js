'use strict';

import { io } from 'mylife-tools-ui';

const getPersonsState = state => state.persons;

export const getSelectorViewId = state => getPersonsState(state).selectorViewId;
export const getSelectorView = state => io.getView(state, getSelectorViewId(state));

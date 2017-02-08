'use strict';

import Immutable from 'immutable';

export const getAllOperations     = (state) => state.management.operations.all.toArray();
export const getVisibleOperations = (state) => state.management.operations.visible.toArray();
export const getSelectedGroupId   = (state) => state.management.selectedGroup;

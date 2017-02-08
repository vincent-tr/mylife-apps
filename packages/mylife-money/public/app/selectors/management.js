'use strict';

export const getAllOperations     = (state) => state.management.operations.all.toArray();
export const getVisibleOperations = (state) => state.management.operations.visible.toArray().map(id => state.management.operations.all.get(id));
export const getSelectedOperations = (state) => state.management.operations.visible.toArray().map(id => state.management.operations.all.get(id));
export const getSelectedGroupId   = (state) => state.management.selectedGroup;

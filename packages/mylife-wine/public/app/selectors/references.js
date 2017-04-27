'use strict';

export const getCapacities = (state) => state.capacities.valueSeq().sortBy(item => item.value).toArray();
export const getDishes     = (state) => state.dishes.valueSeq().sortBy(item => item.name).toArray();
export const getRegions    = (state) => state.regions.valueSeq().sortBy(item => item.name).toArray();
export const getTypes      = (state) => state.types.valueSeq().sortBy(item => item.name).toArray();



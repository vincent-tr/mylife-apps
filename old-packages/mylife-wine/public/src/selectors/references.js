'use strict';

export const getCapacityMap = (state) => state.capacities;
export const getDishMap     = (state) => state.dishes;
export const getRegionMap   = (state) => state.regions;
export const getTypeMap     = (state) => state.types;

export const getCapacities = (state) => state.capacities.valueSeq().sortBy(item => item.value).toArray();
export const getDishes     = (state) => state.dishes.valueSeq().sortBy(item => item.name).toArray();
export const getRegions    = (state) => state.regions.valueSeq().sortBy(item => item.name).toArray();
export const getTypes      = (state) => state.types.valueSeq().sortBy(item => item.name).toArray();

export const getCapacity = (state, { value }) => state.capacities.get(value);
export const getDish     = (state, { value }) => state.dishes.get(value);
export const getRegion   = (state, { value }) => state.regions.get(value);
export const getType     = (state, { value }) => state.types.get(value);

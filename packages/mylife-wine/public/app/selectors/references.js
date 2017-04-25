'use strict';

export const getCapacities = (state) => state.capacities.toArray();
export const getDishes     = (state) => state.dishes.toArray();
export const getRegions    = (state) => state.regions.toArray();
export const getTypes      = (state) => state.types.toArray();
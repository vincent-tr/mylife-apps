'use strict';

export const getStock     = (state) => state.stock.stock.valueSeq().sortBy(item => item.name).toArray();
export const getHistory   = (state) => state.stock.history.valueSeq().sortBy(item => item.date).reverse().toArray();
export const getStockItem = (state, { value }) => state.stock.stock.get(value);

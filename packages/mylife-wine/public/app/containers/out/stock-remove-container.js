'use strict';

import { connect } from 'react-redux';
import { getStockItem } from '../../selectors/stock';
import { removeStock } from '../../actions/stock';

import StockRemove from '../../components/out/stock-remove';

const mapStateToProps = (state, { stockItem }) => ({
  stockItem : stockItem && getStockItem(state, { value: stockItem })
});

const mapDispatchToProps = (dispatch) => ({
  onRemove : (item) => dispatch(removeStock(item))
});

const StockRemoveContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(StockRemove);

export default StockRemoveContainer;

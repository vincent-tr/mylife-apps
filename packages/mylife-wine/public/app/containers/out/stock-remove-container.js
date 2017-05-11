'use strict';

import { connect } from 'react-redux';
import { getCapacities } from '../../selectors/references';
import { removeStock } from '../../actions/stock';

import StockRemove from '../../components/out/stock-remove';

const mapStateToProps = (state) => ({
  capacities : getCapacities(state)
});

const mapDispatchToProps = (dispatch) => ({
  onRemove : (item) => dispatch(removeStock(item))
});

const StockRemoveContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(StockRemove);

export default StockRemoveContainer;

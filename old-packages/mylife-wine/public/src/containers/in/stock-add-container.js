'use strict';

import { connect } from 'react-redux';
import { getCapacities } from '../../selectors/references';
import { addStock } from '../../actions/stock';

import StockAdd from '../../components/in/stock-add';

const mapStateToProps = (state) => ({
  capacities : getCapacities(state)
});

const mapDispatchToProps = (dispatch) => ({
  onAdd : (item) => dispatch(addStock(item))
});

const StockAddContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(StockAdd);

export default StockAddContainer;

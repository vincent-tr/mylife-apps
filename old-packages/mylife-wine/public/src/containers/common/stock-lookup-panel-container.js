'use strict';

import { connect } from 'react-redux';
import { refreshStock } from '../../actions/stock';
import { getRegions, getTypes, getDishes } from '../../selectors/references';

import StockLookupPanel from '../../components/common/stock-lookup-panel';

const mapStateToProps = (state) => ({
  regions : getRegions(state),
  types   : getTypes(state),
  dishes  : getDishes(state)
});

const mapDispatchToProps = {
  onRefresh : refreshStock
};

const StockLookupPanelContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(StockLookupPanel);

export default StockLookupPanelContainer;

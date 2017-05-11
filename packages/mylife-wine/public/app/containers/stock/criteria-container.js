'use strict';

import { connect } from 'react-redux';
import { refreshStock } from '../../actions/stock';
import { getRegions, getTypes, getDishes } from '../../selectors/references';

import Criteria from '../../components/stock/criteria';

const mapStateToProps = (state) => ({
  regions : getRegions(state),
  types   : getTypes(state),
  dishes  : getDishes(state)
});

const mapDispatchToProps = {
  onRefresh : refreshStock
};

const CriteriaContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Criteria);

export default CriteriaContainer;

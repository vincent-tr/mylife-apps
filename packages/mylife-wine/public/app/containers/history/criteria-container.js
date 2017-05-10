'use strict';

import { connect } from 'react-redux';
import { refreshStock } from '../../actions/stock';
import { getRegions, getTypes } from '../../selectors/references';

import Criteria from '../../components/history/criteria';

const mapStateToProps = (state) => ({
  regions  : getRegions(state),
  types    : getTypes(state)
});

const mapDispatchToProps = {
  onRefresh : refreshStock
};

const CriteriaContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Criteria);

export default CriteriaContainer;

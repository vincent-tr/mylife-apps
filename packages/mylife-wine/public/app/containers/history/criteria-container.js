'use strict';

import { connect } from 'react-redux';
import { getRegions, getTypes } from '../../selectors/references';

import Criteria from '../../components/history/criteria';

const mapStateToProps = (state) => ({
  regions  : getRegions(state),
  types    : getTypes(state)
});

const CriteriaContainer = connect(
  mapStateToProps
)(Criteria);

export default CriteriaContainer;

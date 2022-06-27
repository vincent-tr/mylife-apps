'use strict';

import { connect } from 'react-redux';
import { getHistory } from '../../selectors/stock';
import { getArticleMap } from '../../selectors/articles';
import { getTypeMap, getRegionMap, getDishMap, getCapacityMap } from '../../selectors/references';

import Results from '../../components/history/results';

const mapStateToProps = (state) => ({
  history    : getHistory(state),
  articles   : getArticleMap(state),
  types      : getTypeMap(state),
  regions    : getRegionMap(state),
  dishes     : getDishMap(state),
  capacities : getCapacityMap(state),
});

const ResultsContainer = connect(
  mapStateToProps
)(Results);

export default ResultsContainer;

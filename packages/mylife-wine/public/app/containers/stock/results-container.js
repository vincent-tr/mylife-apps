'use strict';

import { connect } from 'react-redux';
import { getStock } from '../../selectors/stock';
import { getArticles } from '../../selectors/articles';
import { getTypeMap, getRegionMap, getDishMap, getCapacityMap } from '../../selectors/references';

import Results from '../../components/stock/results';

const mapStateToProps = (state) => ({
  stock      : getStock(state),
  articles   : getArticles(state),
  types      : getTypeMap(state),
  regions    : getRegionMap(state),
  dishes     : getDishMap(state),
  capacities : getCapacityMap(state),
});

const ResultsContainer = connect(
  mapStateToProps
)(Results);

export default ResultsContainer;

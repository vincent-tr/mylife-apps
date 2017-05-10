'use strict';

import { connect } from 'react-redux';
import { getHistory } from '../../selectors/stock';

import Results from '../../components/history/results';

const mapStateToProps = (state) => ({
  history : getHistory(state)
});

const ResultsContainer = connect(
  mapStateToProps
)(Results);

export default ResultsContainer;

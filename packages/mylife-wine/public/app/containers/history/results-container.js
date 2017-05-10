'use strict';

import { connect } from 'react-redux';
import { getHistory } from '../../selectors/stock';
import { getArticleMap } from '../../selectors/articles';

import Results from '../../components/history/results';

const mapStateToProps = (state) => ({
  history  : getHistory(state),
  articles : getArticleMap(state),
});

const ResultsContainer = connect(
  mapStateToProps
)(Results);

export default ResultsContainer;

'use strict';

import { connect } from 'react-redux';

import Results from '../../components/history/results';

const mapStateToProps = (state, props) => ({
  data : [] // TODO
});

const ResultsContainer = connect(
  mapStateToProps
)(Results);

export default ResultsContainer;

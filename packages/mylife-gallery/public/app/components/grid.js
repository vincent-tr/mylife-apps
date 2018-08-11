'use strict';

import React       from 'react';
import PropTypes   from 'prop-types';
import { connect } from 'react-redux';

import GridList from '@material-ui/core/GridList';

const Grid = ({ agents }) => (
  <GridList>
  </GridList>
);

Grid.propTypes = {
};

const mapStateToProps = () => {
  return (state) => ({
  });
};

const mapDispatchToProps = (dispatch) => ({
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Grid);

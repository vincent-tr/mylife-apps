'use strict';

import React               from 'react';
import PropTypes           from 'prop-types';
import { connect }         from 'react-redux';
import { getMetadataPath } from '../../selectors/metadata';
import { formatContentURL } from '../utils';

const styles = {
  container : {
    position : 'absolute',
    top      : 0,
    bottom   : 0,
    left     : 0,
    right    : 0,
    overflow : 'scroll',
  },
  content : {
    position : 'relative',
    height   : '100%',
    width    : '100%',
    border   : 'none',
    display  : 'block',
  }
};

const Text = ({ path }) => (
  <div style={styles.container}>
    <iframe style={styles.content} src={formatContentURL(path)}></iframe>
  </div>
);

Text.propTypes = {
  path : PropTypes.string,
};

const mapStateToProps = () => {
  return (state) => ({
    path : getMetadataPath(state),
  });
};

export default connect(
  mapStateToProps,
  null
)(Text);

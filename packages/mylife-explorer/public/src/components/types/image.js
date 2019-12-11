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
  },
  image : {
    position : 'relative',
    height    : '100%',
    width     : '100%',
    objectFit : 'scale-down',
  }
};

const Image = ({ path }) => (
  <div style={styles.container}>
    <img src={formatContentURL(path)} style={styles.image} />
  </div>
);

Image.propTypes = {
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
)(Image);

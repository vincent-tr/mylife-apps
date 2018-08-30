'use strict';

import React               from 'react';
import PropTypes           from 'prop-types';
import { connect }         from 'react-redux';
import { getMetadataPath, getMetadataMime } from '../../selectors/metadata';
import { formatContentURL } from '../utils';

const styles = {
  container : {
    overflow : 'auto'
  }
};

const Video = ({ path, mime }) => (
  <div style={styles.container}>
    <video controls width='100%' height='100%'>
      <source src={formatContentURL(path)} type={mime} />
      Your browser does not support HTML5 video.
    </video>
  </div>
);

Video.propTypes = {
  path : PropTypes.string,
  mime : PropTypes.string,
};

const mapStateToProps = () => {
  return (state) => ({
    path : getMetadataPath(state),
    mime : getMetadataMime(state),
  });
};

export default connect(
  mapStateToProps,
  null
)(Video);

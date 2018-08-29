'use strict';

import React              from 'react';
import PropTypes          from 'prop-types';
import { withRouter }     from 'react-router';
import { connect }        from 'react-redux';
import { ensureMetadata } from '../actions/metadata';
import Refresh            from './base/refresh';
import Layout             from './layout';

const RouteWrapper = (({ location, ensureMetadata }) => {
  const path = pathFromLocation(location.pathname);
  return (
    <Refresh trigger={() => ensureMetadata(path)} path={path}>
      <Layout />
    </Refresh>
  );
});

RouteWrapper.propTypes = {
  location       : PropTypes.object.isRequired,
  ensureMetadata : PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  ensureMetadata : path => dispatch(ensureMetadata(path)),
});

export default withRouter(connect(null, mapDispatchToProps)(RouteWrapper));

function pathFromLocation(location) {
  if(location.startsWith('/')) {
    location = location.substring(1);
  }
  if(location.startsWith('path/')) {
    location = location.substring(5);
  }
  return location;
}
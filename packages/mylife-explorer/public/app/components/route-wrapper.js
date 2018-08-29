'use strict';

import React              from 'react';
import PropTypes          from 'prop-types';
import { withRouter }     from 'react-router';
import { connect }        from 'react-redux';
import { ensureMetadata } from '../actions/metadata';
import Refresh            from './base/refresh';
import Dispatcher         from './dispatcher';

const RouteWrapper = (({ location, ensureMetadata }) => {
  return (
    <Refresh trigger={() => ensureMetadata(location.pathname)} path={location.pathname}>
      <Dispatcher />
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

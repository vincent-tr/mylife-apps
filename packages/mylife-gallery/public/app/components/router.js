'use strict';

import React             from 'react';
import PropTypes         from 'prop-types';
import { connect }       from 'react-redux';
import { Router, Route, Switch } from 'react-router-dom';
import history           from '../services/history-factory';

import { ensureAlbums, ensureAlbum, ensureDetail } from '../actions/user';

import Detail from './detail';
import Albums from './albums';
import Album from './album';

const RouterComponent = ({ ensureAlbums, ensureAlbum, ensureDetail }) => (
  <Router history={history}>
    <Switch>
      <Route exact path='/'                    render={({ match }) => ensureAndDisplay(match, ensureAlbums, Albums)} />
      <Route path='/album/:albumName'          render={({ match }) => ensureAndDisplay(match, ensureAlbum, Album)} />
      <Route path='/image/:albumName/:imageId' render={({ match }) => ensureAndDisplay(match, ensureDetail, Detail)} />
    </Switch>
  </Router>
);

function ensureAndDisplay(match, ensure, Component) {
  ensure(match.params);
  return (<Component />);
}

RouterComponent.propTypes = {
  ensureAlbums : PropTypes.func.isRequired,
  ensureAlbum  : PropTypes.func.isRequired,
  ensureDetail : PropTypes.func.isRequired,
};

const mapStateToProps = null;

const mapDispatchToProps = (dispatch) => ({
  ensureAlbums : () => dispatch(ensureAlbums()),
  ensureAlbum  : ({ albumName }) => dispatch(ensureAlbum(albumName)),
  ensureDetail : ({ albumName, imageId }) => dispatch(ensureDetail(albumName, imageId))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RouterComponent);

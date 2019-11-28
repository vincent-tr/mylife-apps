'use strict';

import React             from 'react';
import PropTypes         from 'prop-types';
import { connect }       from 'react-redux';
import { Router, Route, Switch } from 'react-router-dom';
import history           from '../services/history-factory';

import { ensureAlbums, ensureAlbum, ensureDetail } from '../actions/user';

import Refresh from './refresh';
import Albums from './albums';
import Album from './album';
import Detail from './detail';
import Carousel from './carousel';

const AlbumsWrapper = connect(
  null,
  (dispatch) => ({
    ensureAlbums : () => dispatch(ensureAlbums()),
  })
)(({ ensureAlbums }) => {
  return (
    <Refresh trigger={() => ensureAlbums()}>
      <Albums />
    </Refresh>
  );
});

const AlbumWrapper = connect(
  null,
  (dispatch) => ({
    ensureAlbum  : albumName => dispatch(ensureAlbum(albumName)),
  })
)(({ match, ensureAlbum }) => {
  const albumName = getMatchParam(match, 'albumName');
  return (
    <Refresh trigger={() => ensureAlbum(albumName)} albumName={albumName}>
      <Album />
    </Refresh>
  );
});

const DetailWrapper = connect(
  null,
  (dispatch) => ({
    ensureDetail : (albumName, imageId) => dispatch(ensureDetail(albumName, imageId))
  })
)(({ match, ensureDetail }) => {
  const albumName = getMatchParam(match, 'albumName');
  const imageId = getMatchParam(match, 'imageId');
  return (
    <Refresh trigger={() => ensureDetail(albumName, imageId)} albumName={albumName} imageId={imageId}>
      <Detail />
    </Refresh>
  );
});

const CarouselWrapper = connect(
  null,
  (dispatch) => ({
    ensureAlbum  : albumName => dispatch(ensureAlbum(albumName)),
  })
)(({ match, ensureAlbum }) => {
  const albumName = getMatchParam(match, 'albumName');
  return (
    <Refresh trigger={() => ensureAlbum(albumName)} albumName={albumName}>
      <Carousel />
    </Refresh>
  );
});

const RouterComponent = () => (
  <Router history={history}>
    <Switch>
      <Route exact path='/'                    component={AlbumsWrapper} />
      <Route path='/album/:albumName'          component={AlbumWrapper} />
      <Route path='/image/:albumName/:imageId' component={DetailWrapper} />
      <Route path='/carousel/:albumName'       component={CarouselWrapper} />
    </Switch>
  </Router>
);

export default RouterComponent;

function getMatchParam(match, name) {
  return match && match.params && match.params[name];
}

'use strict';

import React       from 'react';
import PropTypes   from 'prop-types';
import { connect } from 'react-redux';

import { getAlbum } from '../selectors';
import { showDetail, hideAlbum, showCarousel } from '../actions/user';

import IconButton from '@material-ui/core/IconButton';
import CarouselIcon from '@material-ui/icons/ViewCarousel';

import Layout from './layout';
import Grid from './grid';

const Album = ({ album, showDetail, hideAlbum, showCarousel }) => album && (
  <Layout title={`${album.name || '(Indéfini)'} - ${album.items.length} photos`} onClose={hideAlbum} buttons={
    <IconButton onClick={showCarousel} color='inherit'>
      <CarouselIcon />
    </IconButton>
  }>
    <Grid
      onItemClick={item => showDetail(item.source)}
      items={album.items.map(item => ({
        source : item,
        id     : item.id,
        title  : item.name,
        image  : '/images/thumbnail/' + item.id
      }))}
    />
  </Layout>
);

Album.propTypes = {
  album        : PropTypes.object,
  showDetail   : PropTypes.func.isRequired,
  hideAlbum    : PropTypes.func.isRequired,
  showCarousel : PropTypes.func.isRequired,
};

const mapStateToProps = () => {
  return (state) => ({
    album : getAlbum(state)
  });
};

const mapDispatchToProps = (dispatch) => ({
  showDetail   : item => dispatch(showDetail(item)),
  hideAlbum    : () => dispatch(hideAlbum()),
  showCarousel : () => dispatch(showCarousel()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Album);

'use strict';

import React       from 'react';
import PropTypes   from 'prop-types';
import { connect } from 'react-redux';

import { getAlbum } from '../selectors';
import { showDetail, hideAlbum } from '../actions/user';

import Layout from './layout';
import Grid from './grid';

const Album = ({ album, showDetail, hideAlbum }) => (
  <Layout title={`${album.name || '(Indéfini)'} - ${album.items.length} photos`} onClose={hideAlbum}>
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
  album      : PropTypes.object.isRequired,
  showDetail : PropTypes.func.isRequired,
  hideAlbum  : PropTypes.func.isRequired,
};

const mapStateToProps = () => {
  return (state) => ({
    album : getAlbum(state)
  });
};

const mapDispatchToProps = (dispatch) => ({
  showDetail : item => dispatch(showDetail(item)),
  hideAlbum  : () => dispatch(hideAlbum())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Album);

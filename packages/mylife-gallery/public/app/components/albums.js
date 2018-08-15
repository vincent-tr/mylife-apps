'use strict';

import React       from 'react';
import PropTypes   from 'prop-types';
import { connect } from 'react-redux';

import { getAlbums } from '../selectors';
import { showAlbum } from '../actions/user';

import Layout from './layout';
import Grid from './grid';

const Albums = ({ items, showAlbum }) => (
  <Layout title='Albums'>
    <Grid
      onItemClick={item => showAlbum(item.source.name)}
      items={items.map(item => ({
        source : item,
        id     : item.name || '<unset>',
        image  : '/images/thumbnail/' + item.first,
        title  : item.name || '(Indéfini)'
      }))} />
  </Layout>
);

Albums.propTypes = {
  items     : PropTypes.array.isRequired,
  showAlbum : PropTypes.func.isRequired
};

const mapStateToProps = () => {
  return (state) => ({
    items : getAlbums(state)
  });
};

const mapDispatchToProps = (dispatch) => ({
  showAlbum : item => dispatch(showAlbum(item))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Albums);

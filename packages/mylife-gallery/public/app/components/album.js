'use strict';

import React       from 'react';
import PropTypes   from 'prop-types';
import { connect } from 'react-redux';

import { getAlbum } from '../selectors';
import { showDetail, hideAlbum } from '../actions/user';

import Layout from './layout';

import GridListTileBar from '@material-ui/core/GridListTileBar';
import IconButton from '@material-ui/core/IconButton';
import FullScreenIcon from '@material-ui/icons/FullScreen';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  list : {
    margin : 10,
  },
  item : {
    display       : 'inline-block',
    position      : 'relative',
    height        : 200,
    width         : 200,
    margin        : 2,
  },
  image : {
    position : 'absolute',
    margin   : 'auto',
    top      : 0,
    left     : 0,
    right    : 0,
    bottom   : 0,
  }
});

const Album = ({ album, classes, showDetail, hideAlbum }) => (
  <Layout title={album.name} onClose={hideAlbum}>
    <div className={classes.list}>
      {album.items.map(item => (
        <div key={item.id} className={classes.item}>

          <img src={'/images/thumbnail/' + item.id} className={classes.image} />

          <GridListTileBar
            title={item.name}
            actionIcon={
              <IconButton onClick={() => showDetail(item)}>
                <FullScreenIcon />
              </IconButton>
            }
          />
        </div>
      ))}
    </div>
  </Layout>
);

Album.propTypes = {
  album      : PropTypes.object.isRequired,
  showDetail : PropTypes.func.isRequired,
  hideAlbum  : PropTypes.func.isRequired,
  classes    : PropTypes.object.isRequired,
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
)(withStyles(styles)(Album));

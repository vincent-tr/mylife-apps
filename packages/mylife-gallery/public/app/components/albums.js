'use strict';

import React       from 'react';
import PropTypes   from 'prop-types';
import { connect } from 'react-redux';

import { getAlbums } from '../selectors';
import { showAlbum } from '../actions/user';

import Layout from './layout';

import GridListTileBar from '@material-ui/core/GridListTileBar';
import Button from '@material-ui/core/Button';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  list : {
    margin : 10,
  },
  item : {
    display  : 'inline-block',
    height   : 248,
    width    : 200,
    margin   : 2,
    position : 'relative'
  },
  imageContainer : {
    position : 'absolute',
    top      : 0,
    left     : 0,
    right    : 0,
    height   : 200,
  },
  image : {
    position : 'absolute',
    margin   : 'auto',
    top      : 0,
    left     : 0,
    right    : 0,
    bottom   : 0,
  },
  title : {
    flex : 1
  }
});

const Albums = ({ items, classes, showAlbum }) => (
  <Layout title='Albums'>
    <div className={classes.list}>
      {items.map(item => (
        <Button key={item.name || '<unset>'} className={classes.item} onClick={() => showAlbum(item.name)}>
          <div className={classes.imageContainer}>
            <img src={'/images/thumbnail/' + item.first} className={classes.image} />
          </div>
          <GridListTileBar className={classes.title} title={item.name} />
        </Button>
      ))}
    </div>
  </Layout>
);

Albums.propTypes = {
  items     : PropTypes.array.isRequired,
  showAlbum : PropTypes.func.isRequired,
  classes   : PropTypes.object.isRequired,
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
)(withStyles(styles)(Albums));

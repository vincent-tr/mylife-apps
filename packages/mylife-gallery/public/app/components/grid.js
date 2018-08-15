'use strict';

import React       from 'react';
import PropTypes   from 'prop-types';

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

const Grid = ({ classes, items, onItemClick }) => (
  <div className={classes.list}>
    {items.map(item => (
      <Button key={item.id} className={classes.item} onClick={() => onItemClick(item)}>
        <div className={classes.imageContainer}>
          <img src={item.image} className={classes.image} />
        </div>
        <GridListTileBar className={classes.title} title={item.title} />
      </Button>
    ))}
  </div>
);

Grid.propTypes = {
  items       : PropTypes.array.isRequired,
  onItemClick : PropTypes.func.isRequired,
  classes     : PropTypes.object.isRequired,
};

export default withStyles(styles)(Grid);

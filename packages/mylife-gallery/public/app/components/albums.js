'use strict';

import React       from 'react';
import PropTypes   from 'prop-types';
import { connect } from 'react-redux';

import { getAlbums } from '../selectors';
import { showAlbum } from '../actions/user';

import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import FullScreenIcon from '@material-ui/icons/FullScreen';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  list : {
    flexWrap : 'nowrap',
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

const Albums = ({ items, classes, showAlbum }) => (
  <div className={classes.list}>
    {items.map(item => (
      <Card key={item}>
        <CardContent>
          <Typography>
            {item}
          </Typography>
        </CardContent>
        <CardActions>
          <IconButton onClick={() => showAlbum(item)}>
            <FullScreenIcon />
          </IconButton>
        </CardActions>
      </Card>
    ))}
  </div>
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

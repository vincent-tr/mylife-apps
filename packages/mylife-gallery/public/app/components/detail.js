'use strict';

import React       from 'react';
import PropTypes   from 'prop-types';
import { connect } from 'react-redux';

import { getDetail } from '../selectors';
import { hideDetail } from '../actions/user';

import IconButton from '@material-ui/core/IconButton';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import CloseIcon from '@material-ui/icons/Close';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  modal : {
    position        : 'absolute',
    top             : 0,
    bottom          : 0,
    left            : 0,
    right           : 0,
    backgroundColor : theme.palette.background.paper,
  },
  container : {
    position : 'relative',
    height   : '100%',
    width    : '100%',
  },
  image : {
    position : 'relative',
    height   : '100%',
    width    : '100%',
    objectFit : 'scale-down',
  }
});

const DetailPopup = ({ item, close, classes }) => (
  <div className={classes.modal}>
    <img src={'/images/raw/' + item.id} className={classes.image} />

    <GridListTileBar
      titlePosition='top'
      title={`${item.album} - ${item.name}`}
      actionIcon={
        <IconButton onClick={close}>
          <CloseIcon />
        </IconButton>
      }
    />

  </div>
);

DetailPopup.propTypes = {
  item    : PropTypes.object.isRequired,
  close   : PropTypes.func.isRequired,
  classes : PropTypes.object.isRequired,
};

const mapStateToProps = () => {
  return (state) => ({
    item : getDetail(state),
  });
};

const mapDispatchToProps = (dispatch) => ({
  close : () => dispatch(hideDetail())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(DetailPopup));

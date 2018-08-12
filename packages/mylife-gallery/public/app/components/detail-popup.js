'use strict';

import React       from 'react';
import PropTypes   from 'prop-types';
import { connect } from 'react-redux';

import { isDetail, getDetailId, getDetailName, getDetailAlbum } from '../selectors/detail';
import { hideDetail } from '../actions/user';

import Modal from '@material-ui/core/Modal';
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

const DetailPopup = ({ visible, id, name, album, close, classes }) => (
  <Modal
    aria-labelledby="simple-modal-title"
    aria-describedby="simple-modal-description"
    open={visible}
    onClose={close}
  >
    <div className={classes.modal}>
      <img src={'/images/raw/' + id} className={classes.image} />

      <GridListTileBar
        titlePosition='top'
        title={`${album} - ${name}`}
        actionIcon={
          <IconButton onClick={close}>
            <CloseIcon />
          </IconButton>
        }
      />

    </div>
  </Modal>
);

DetailPopup.propTypes = {
  visible : PropTypes.bool.isRequired,
  id      : PropTypes.string,
  name    : PropTypes.string,
  album   : PropTypes.string,
  close   : PropTypes.func.isRequired,
  classes : PropTypes.object.isRequired,
};

const mapStateToProps = () => {
  return (state) => ({
    visible : isDetail(state),
    id      : getDetailId(state),
    name    : getDetailName(state),
    album   : getDetailAlbum(state)
  });
};

const mapDispatchToProps = (dispatch) => ({
  close : () => dispatch(hideDetail())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(DetailPopup));

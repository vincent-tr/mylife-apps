'use strict';

import React       from 'react';
import PropTypes   from 'prop-types';
import { connect } from 'react-redux';

import { getAlbum } from '../selectors';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  container : {
    position : 'absolute',
    top      : 0,
    bottom   : 0,
    left     : 0,
    right    : 0,
    overflow : 'hidden'
  },
  image : {
    backgroundColor : theme.palette.grey[500],
    position  : 'relative',
    height    : '100%',
    width     : '100%',
    objectFit : 'scale-down',
  }
});

class Carousel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if(nextProps.album === prevState.album) {
      return null;
    }

    return {
      album : nextProps.album,
      index : 0
    };
  }

  render() {
    const { classes, album } = this.props;
    if(!album) {
      return;
    }

    return (
      <div className={classes.container}>
        <img src={'/images/raw/' + album.items[0].id} className={classes.image} />
      </div>
    );
  }
}

Carousel.propTypes = {
  classes : PropTypes.object.isRequired,
  album   : PropTypes.object,
};

const mapStateToProps = () => {
  return (state) => ({
    album : getAlbum(state)
  });
};

export default connect(
  mapStateToProps,
  null
)(withStyles(styles)(Carousel));

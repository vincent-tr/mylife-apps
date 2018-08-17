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
    this.state = {};
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

  componentDidMount() {
    this.timer = setInterval(() => this.switch(), 5000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    this.timer = null;
  }

  switch() {
    this.setState((prevState, props) => {
      const { album } = props;
      if(!album) {
        return {};
      }

      if(album.items.length < 2) {
        return { index : 0 };
      }

      let index;
      do {
        index = Math.floor(Math.random() * album.items.length);
      } while(index === prevState.index);

      return { index };
    });
  }

  render() {
    const { classes, album } = this.props;
    const { index } = this.state;
    if(!album) {
      return null;
    }

    return (
      <div className={classes.container}>
        <img src={'/images/raw/' + album.items[index].id} className={classes.image} />
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

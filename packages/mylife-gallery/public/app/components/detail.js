'use strict';

import React       from 'react';
import PropTypes   from 'prop-types';
import { connect } from 'react-redux';

import { getDetail, getPrevDetail, getNextDetail } from '../selectors';
import { hideDetail, showDetail } from '../actions/user';

import Button from '@material-ui/core/Button';

import Layout from './layout';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  container : {
    position        : 'absolute',
    top             : 0,
    bottom          : 0,
    left            : 0,
    right           : 0,
    backgroundColor : theme.palette.background.paper,
  },
  image : {
    position : 'relative',
    height   : '100%',
    width    : '100%',
    objectFit : 'scale-down',
  }
});

const Detail = ({ item, prev, next, close, move, classes }) => (
  <Layout title={`${item.album || '(Indéfini)'} - ${item.name}`} onClose={close} noScroll={true}>
    <div className={classes.container}>
      <div style={{position : 'absolute'}}>
        {prev && <Button onClick={() => move(prev)}>prev</Button>}
        {next && <Button onClick={() => move(next)}>next</Button>}
      </div>
      <img src={'/images/raw/' + item.id} className={classes.image} />
    </div>
  </Layout>
);

Detail.propTypes = {
  item    : PropTypes.object.isRequired,
  prev    : PropTypes.object,
  next    : PropTypes.object,
  close   : PropTypes.func.isRequired,
  move    : PropTypes.func.isRequired,
  classes : PropTypes.object.isRequired,
};

const mapStateToProps = () => {
  return (state) => ({
    item : getDetail(state),
    prev : getPrevDetail(state),
    next : getNextDetail(state),
  });
};

const mapDispatchToProps = (dispatch) => ({
  close : () => dispatch(hideDetail()),
  move  : item => dispatch(showDetail(item)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(Detail));

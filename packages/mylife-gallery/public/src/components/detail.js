'use strict';

import React         from 'react';
import PropTypes     from 'prop-types';
import { connect }   from 'react-redux';
import OrientedImage from './base/oriented-image';

import { getDetail, getPrevDetail, getNextDetail } from '../selectors';
import { hideDetail, showDetail } from '../actions/user';

import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import PrevIcon from '@material-ui/icons/ChevronLeft';
import NextIcon from '@material-ui/icons/ChevronRight';

import Layout from './layout';
import Location from './location';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  container : {
    position : 'absolute',
    top      : 0,
    bottom   : 0,
    left     : 0,
    right    : 0,
    display  : 'flex',
  },
  panel : {
    flex            : '0 0 18em',
    backgroundColor : theme.palette.grey[100], // cf : https://github.com/mui-org/material-ui/blob/master/packages/material-ui/src/AppBar/AppBar.js
    padding         : 10,
    overflowY       : 'auto',
  },
  imageContainer : {
    flex            : 1,
    backgroundColor : theme.palette.background.paper,
  },
  image : {
    position  : 'relative',
    height    : '100%',
    width     : '100%',
    objectFit : 'scale-down',
  }
});

const Detail = ({ item, prev, next, close, move, classes }) => item && (
  <Layout title={`${item.album || '(Indéfini)'} - ${item.name}`} onClose={close} noScroll={true}>
    <div className={classes.container}>
      <div className={classes.imageContainer}>
        <OrientedImage src={'/images/raw/' + item.id} className={classes.image} />
      </div>
      <Paper square className={classes.panel}>
        <List>
          <ListItem>
            <Toolbar>
              <IconButton disabled={!prev} onClick={() => move(prev)}>
                <PrevIcon />
              </IconButton>
              <IconButton disabled={!next} onClick={() => move(next)}>
                <NextIcon />
              </IconButton>
            </Toolbar>
          </ListItem>
          {item.date && (
            <ListItem>
              <ListItemText primary='Date' secondary={item.date} />
            </ListItem>
          )}
          {item.from && (
            <ListItem>
              <ListItemText primary='Provenance' secondary={item.from} />
            </ListItem>
          )}
          {item.gps && (
            <ListItem>
              <ListItemText primary='Localisation' secondary={
                <Typography component='div'>
                  <Location latitude={item.gps.latitude} longitude={item.gps.longitude} />
                </Typography>
              } />
            </ListItem>
          )}
          {item.tags && !!item.tags.length && (
            <ListItem>
              <ListItemText primary='Tags' secondary={
                <React.Fragment>
                  {item.tags.map((tag, i) => (
                    <span key={i}>
                      {tag}
                      <br/>
                    </span>
                  ))}
                </React.Fragment>
              } />
            </ListItem>
          )}
        </List>
      </Paper>
    </div>
  </Layout>
);

Detail.propTypes = {
  item    : PropTypes.object,
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

'use strict';

import React       from 'react';
import PropTypes   from 'prop-types';
import { connect } from 'react-redux';

import { isAlbum, isDetail } from '../selectors';

import Detail from './detail';
import Albums from './albums';
import Album from './album';

const Router = ({ detail, album }) => {
  if(detail) {
    return (<Detail />);
  }
  if(album) {
    return (<Album />);
  }
  return (<Albums />);
};

Router.propTypes = {
  detail : PropTypes.bool.isRequired,
  album  : PropTypes.bool.isRequired,
};

const mapStateToProps = () => {
  return (state) => ({
    detail : isDetail(state),
    album  : isAlbum(state)
  });
};

export default connect(
  mapStateToProps,
  null
)(Router);

'use strict';

import React                                from 'react';
import PropTypes                            from 'prop-types';
import { connect }                          from 'react-redux';
import { getMetadataType, getMetadataMime } from '../selectors/metadata';
import { getTypeInfo }                      from './types';

const Dispatcher = ({ type, mime }) => {
  const { Component } = getTypeInfo({ type, mime });
  return (
    <Component />
  );
};

Dispatcher.propTypes = {
  type : PropTypes.string,
  mime : PropTypes.string,
};

const mapStateToProps = () => {
  return (state) => ({
    type : getMetadataType(state),
    mime : getMetadataMime(state),
  });
};

export default connect(
  mapStateToProps,
  null
)(Dispatcher);

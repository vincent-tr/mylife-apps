'use strict';

import React               from 'react';
import PropTypes           from 'prop-types';
import { connect }         from 'react-redux';
import { getMetadataType } from '../selectors/metadata';

import Default     from './types/default';
import Directory   from './types/directory';

const types = {
  Unknown : Default,
  Directory
};

const Dispatcher = ({ type }) => {
  const Component = types[type] || Default;
  return (
    <Component />
  );
};

Dispatcher.propTypes = {
  type : PropTypes.string,
};

const mapStateToProps = () => {
  return (state) => ({
    type : getMetadataType(state)
  });
};

export default connect(
  mapStateToProps,
  null
)(Dispatcher);

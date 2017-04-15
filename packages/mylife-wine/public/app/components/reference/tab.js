'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import * as mui from 'material-ui';

const Tab = ({ list, onCreate, onUpdate }) => (
  <span>reference index</span>
);

Tab.propTypes = {
  list   : PropTypes.arrayOf(PropTypes.object),
  onCreate : PropTypes.func.isRequired,
  onUpdate : PropTypes.func.isRequired
};

export default Tab;
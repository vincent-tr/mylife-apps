'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import * as mui from 'material-ui';
import base from '../base/index';
import tabStyles from '../base/tab-styles';

const Results = () => (<div>results</div>);

Results.propTypes = {
  criteria   : PropTypes.object.isRequired,
  stock      : PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  articles   : PropTypes.object.isRequired,
  types      : PropTypes.object.isRequired,
  regions    : PropTypes.object.isRequired,
  dishes     : PropTypes.object.isRequired,
  capacities : PropTypes.object.isRequired,
};

export default Results;
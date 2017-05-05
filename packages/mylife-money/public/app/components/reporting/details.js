'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import GroupAbsoluteByMonth from './group-absolute-by-month';

const reports = {
  groupAbsoluteByMonth: GroupAbsoluteByMonth
};

const Details = ({ value }) => {
  const Report = reports[value];
  if(!Report) {
    return null;
  }
  return (<Report />);
};

Details.propTypes = {
  value : PropTypes.string,
};

export default Details;
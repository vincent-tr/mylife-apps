'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import GroupAbsoluteByMonth from './group-absolute-by-month';

const reports = {
  groupAbsoluteByMonth: GroupAbsoluteByMonth
};

const Details = ({ value, groups, groupBags, groupStacks, operations, onRefreshOperations }) => {
  const Report = reports[value];
  if(!Report) {
    return null;
  }
  return (<Report groups={groups} groupBags={groupBags} groupStacks={groupStacks} operations={operations} onRefreshOperations={onRefreshOperations} />);
};

Details.propTypes = {
  value               : PropTypes.string,
  groups              : PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  groupBags           : PropTypes.object.isRequired,
  groupStacks         : PropTypes.object.isRequired,
  operations          : PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  onRefreshOperations : PropTypes.func.isRequired,
};

export default Details;
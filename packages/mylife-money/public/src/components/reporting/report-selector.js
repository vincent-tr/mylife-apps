'use strict';

import { React } from 'mylife-tools-ui';
import PropTypes from 'prop-types';
import * as mui from '@material-ui/core';

const ReportSelector = ({ value, onChange }) => (
  <mui.List component="nav">
    <mui.ListItem button selected={value === 'groupAbsoluteByMonth'} onClick={() => onChange('groupAbsoluteByMonth')}>Montant par mois de groupes</mui.ListItem>
    <mui.ListItem button selected={value === 'todo'} onClick={() => onChange('todo')}>Report #2</mui.ListItem>
  </mui.List>
);

ReportSelector.propTypes = {
  value    : PropTypes.string,
  onChange : PropTypes.func.isRequired
};

export default ReportSelector;

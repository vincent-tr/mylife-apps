'use strict';

import { React } from 'mylife-tools-ui';
import PropTypes from 'prop-types';
import * as mui from '@material-ui/core';

import selectorDialog from './group-selector-dialog';

const GroupSelectorDialog = ({ onSelect, ...props }) => (
  <mui.IconButton onClick={() => selectorDialog({ proceed: onSelect})} {...props} />
);

GroupSelectorDialog.propTypes = {
  onSelect : PropTypes.func.isRequired,
};

export default GroupSelectorDialog;

'use strict';

import { React } from 'mylife-tools-ui';
import PropTypes from 'prop-types';
import { mui } from 'mylife-tools-ui';

import selectorDialog from './group-selector-dialog';

const GroupSelectorDialog = React.forwardRef(({ onSelect, ...props }, ref) => (
  <mui.IconButton ref={ref} onClick={() => selectorDialog({ proceed: onSelect})} {...props} />
));

GroupSelectorDialog.propTypes = {
  onSelect : PropTypes.func.isRequired,
};

export default GroupSelectorDialog;

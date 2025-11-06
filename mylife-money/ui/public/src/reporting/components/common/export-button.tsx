'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { mui } from 'mylife-tools-ui';
import icons from '../../../common/icons';

const ExportButton = ({ onClick, ...props }) => (
  <mui.Tooltip title='Exporter les données'>
    <mui.IconButton {...props} onClick={wrapClick(onClick)}>
      <icons.actions.Export />
    </mui.IconButton>
  </mui.Tooltip>
);

ExportButton.propTypes = {
  onClick: PropTypes.func
};

export default ExportButton;

function wrapClick(onClick) {
  if(!onClick) {
    return onClick;
  }

  return (e) => {
    e.stopPropagation();
    onClick(e);
  };
}

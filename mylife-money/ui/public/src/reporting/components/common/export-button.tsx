'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import icons from '../../../common/icons';
import { Tooltip, IconButton } from '@material-ui/core';

const ExportButton = ({ onClick, ...props }) => (
  <Tooltip title='Exporter les données'>
    <IconButton {...props} onClick={wrapClick(onClick)}>
      <icons.actions.Export />
    </IconButton>
  </Tooltip>
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

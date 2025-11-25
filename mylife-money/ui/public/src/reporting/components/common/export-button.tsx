import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import PropTypes from 'prop-types';
import React from 'react';
import icons from '../../../common/icons';

const ExportButton = ({ onClick, ...props }) => (
  <Tooltip title="Exporter les données">
    <IconButton {...props} onClick={wrapClick(onClick)}>
      <icons.actions.Export />
    </IconButton>
  </Tooltip>
);

ExportButton.propTypes = {
  onClick: PropTypes.func,
};

export default ExportButton;

function wrapClick(onClick) {
  if (!onClick) {
    return onClick;
  }

  return (e) => {
    e.stopPropagation();
    onClick(e);
  };
}

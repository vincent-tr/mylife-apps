import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import React from 'react';
import icons from '../../../common/icons';

interface ExportButtonProps extends IconButtonProps {
  onClick?: (e: React.MouseEvent) => void;
}

const ExportButton: React.FC<ExportButtonProps> = ({ onClick, ...props }) => (
  <Tooltip title="Exporter les données">
    <IconButton {...props} onClick={wrapClick(onClick)}>
      <icons.actions.Export />
    </IconButton>
  </Tooltip>
);

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

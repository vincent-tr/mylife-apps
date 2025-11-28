import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import React from 'react';
import icons from '../../../common/icons';

export interface ExportButtonProps extends Omit<React.ComponentProps<typeof IconButton>, 'onClick'> {
  onClick?: (e: React.MouseEvent) => void;
}

export default function ExportButton({ onClick, ...props }: ExportButtonProps) {
  return (
    <Tooltip title="Exporter les données">
      <IconButton {...props} onClick={wrapClick(onClick)}>
        <icons.actions.Export />
      </IconButton>
    </Tooltip>
  );
}

function wrapClick(onClick) {
  if (!onClick) {
    return onClick;
  }

  return (e) => {
    e.stopPropagation();
    onClick(e);
  };
}

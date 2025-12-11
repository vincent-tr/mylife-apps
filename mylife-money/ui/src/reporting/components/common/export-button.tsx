import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import React, { useMemo } from 'react';
import icons from '../../../common/icons';

export interface ExportButtonProps extends Omit<React.ComponentProps<typeof IconButton>, 'onClick'> {
  onClick?: (e: React.MouseEvent) => void;
}

export default function ExportButton({ onClick, ...props }: ExportButtonProps) {
  const handleClick = useMemo(() => {
    if (!onClick) {
      return null;
    }

    return (e: React.MouseEvent) => {
      e.stopPropagation();
      onClick(e);
    };
  }, [onClick]);

  return (
    <Tooltip title="Exporter les données">
      <IconButton {...props} onClick={handleClick}>
        <icons.actions.Export />
      </IconButton>
    </Tooltip>
  );
}

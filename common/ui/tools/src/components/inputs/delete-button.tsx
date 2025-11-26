import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import React, { FunctionComponent, useState } from 'react';

const StyledButton = styled(Button)(({ theme }) => ({
  color: theme.palette.getContrastText(theme.palette.error.main),
  backgroundColor: theme.palette.error.main,
  '&:hover': {
    backgroundColor: theme.palette.error.dark,
  },
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.getContrastText(theme.palette.error.main),
  backgroundColor: theme.palette.error.main,
  '&:hover': {
    backgroundColor: theme.palette.error.dark,
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  '& > *': {
    margin: theme.spacing(2),
  },
}));

interface DeleteButtonProps {
  disabled?: boolean;
  icon?: boolean;
  text?: React.ReactNode;
  tooltip?: React.ReactNode;
  confirmText?: React.ReactNode;
  onConfirmed?: () => void;
  className?: string;
  disablePortal?: boolean;
}

const DeleteButton: FunctionComponent<DeleteButtonProps> = ({
  icon = false,
  text = null,
  tooltip = null,
  confirmText = 'Etes-vous sûr ?',
  onConfirmed,
  className,
  disablePortal = false,
  ...props
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const handleButtonClick = (e) => setAnchorEl(e.target);
  const handleClose = () => setAnchorEl(null);
  const handleConfirm = () => {
    handleClose();
    onConfirmed?.();
  };

  const handleTooltipOpen = () => setTooltipOpen(true);
  const handleTooltipClose = () => setTooltipOpen(false);
  const isTooltipOpen = tooltipOpen && !anchorEl; // do not show tooltip when popup is shown

  let button = text ? (
    <StyledButton variant="contained" className={className} onClick={handleButtonClick} startIcon={icon ? <DeleteIcon /> : null} {...props}>
      {text}
    </StyledButton>
  ) : (
    <StyledIconButton className={className} onClick={handleButtonClick}>
      <DeleteIcon />
    </StyledIconButton>
  );

  if (tooltip) {
    button = (
      <Tooltip title={tooltip} open={isTooltipOpen} onOpen={handleTooltipOpen} onClose={handleTooltipClose}>
        {button}
      </Tooltip>
    );
  }

  return (
    <>
      {button}
      <Popper open={!!anchorEl} anchorEl={anchorEl} disablePortal={disablePortal}>
        <ClickAwayListener onClickAway={handleClose}>
          <StyledPaper>
            <Typography>{confirmText}</Typography>
            <StyledButton variant="contained" onClick={handleConfirm}>
              {'Supprimer'}
            </StyledButton>
          </StyledPaper>
        </ClickAwayListener>
      </Popper>
    </>
  );
};

export default DeleteButton;

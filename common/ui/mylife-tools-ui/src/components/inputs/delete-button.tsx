import React, {FunctionComponent, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, IconButton, Tooltip, Popper, ClickAwayListener, Paper, Typography, makeStyles } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  button: {
    color: theme.palette.getContrastText(theme.palette.error.main),
    backgroundColor: theme.palette.error.main,
    '&:hover': {
      backgroundColor: theme.palette.error.dark,
    }
  },
  paper: {
    padding: theme.spacing(2),
    '& > *': {
      margin: theme.spacing(2)
    },
  }
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

const DeleteButton: FunctionComponent<DeleteButtonProps> = ({ icon = false, text = null, tooltip = null, confirmText = 'Etes-vous sûr ?', onConfirmed, className, disablePortal = false, ...props }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const handleButtonClick = e => setAnchorEl(e.target);
  const handleClose = () => setAnchorEl(null);
  const handleConfirm = () => {
    handleClose();
    onConfirmed && onConfirmed();
  };

  const handleTooltipOpen = () => setTooltipOpen(true);
  const handleTooltipClose = () => setTooltipOpen(false);
  const isTooltipOpen = tooltipOpen && !anchorEl; // do not show tooltip when popup is shown

  let button = text ? (
    <Button
      variant='contained'
      className={clsx(classes.button, className)}
      onClick={handleButtonClick}
      startIcon={icon ? <DeleteIcon /> : null}
      {...props}
    >
      {text}
    </Button>
  ) : (
    <IconButton
      className={clsx(classes.button, className)}
      onClick={handleButtonClick}
    >
      <DeleteIcon />
    </IconButton>
  );

  if(tooltip) {
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
          <Paper className={classes.paper}>
            <Typography>{confirmText}</Typography>
            <Button
              variant='contained'
              className={classes.button}
              onClick={handleConfirm}
            >
              {'Supprimer'}
            </Button>
          </Paper>
        </ClickAwayListener>
      </Popper>
    </>
  );
};

DeleteButton.propTypes = {
  icon: PropTypes.bool,
  text: PropTypes.string,
  tooltip: PropTypes.string,
  confirmText: PropTypes.string,
  onConfirmed: PropTypes.func,
  className: PropTypes.string,
  disablePortal: PropTypes.bool,
};

export default DeleteButton;

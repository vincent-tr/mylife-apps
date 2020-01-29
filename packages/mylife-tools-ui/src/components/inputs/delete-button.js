'use strict';

import React, {useState } from 'react';
import PropTypes from 'prop-types';
import { Button, IconButton, Tooltip, Popper, ClickAwayListener, Paper, Typography, makeStyles } from '@material-ui/core';
import { Delete as DeleteIcon } from '@material-ui/icons';

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

const DeleteButton = ({ icon = false, text = null, tooltip = null, confirmText = 'Etes-vous sûr ?', onConfirmed }) => {
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
      className={classes.button}
      onClick={handleButtonClick}
      startIcon={icon ? <DeleteIcon /> : null}
    >
      {text}
    </Button>
  ) : (
    <IconButton
      className={classes.button}
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
      <Popper open={!!anchorEl} anchorEl={anchorEl}>
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
  onConfirmed: PropTypes.func
};

export default DeleteButton;

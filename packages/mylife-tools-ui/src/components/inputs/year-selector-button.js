'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import * as dialogs from '../../modules/dialogs/helpers';
import { makeStyles, Dialog, DialogContent, DialogActions, Button, Tooltip, IconButton } from '@material-ui/core';
import { DatePicker } from '@material-ui/pickers';
import { CalendarTodayIcon } from '@material-ui/icons';

const useStyles = makeStyles({
  actions: {
    // https://github.com/mui-org/material-ui-pickers/blob/next/lib/src/_shared/ModalDialog.tsx
    justifyContent: 'flex-start',

    '& > *:first-child': {
      marginRight: 'auto',
    },
  },
});

const YearSelectorDialog = ({ show, proceed, options }) => {
  const classes = useStyles();
  return (
    <Dialog open={show} onClose={() => proceed({ result: 'cancel' })} >
      <DialogContent dividers>
        <DatePicker autoOk variant='static' views={['year']} value={options.value} onChange={selectedValue => proceed({ result: 'ok', selectedValue })} />
      </DialogContent>

      <DialogActions classes={{ root: classes.actions }}>
        <Button onClick={() => proceed({ result: 'ok', selectedValue: null })} color='primary'>Aucun</Button>
        <Button onClick={() => proceed({ result: 'cancel' })} color='primary'>Annuler</Button>
        <Button onClick={() => proceed({ result: 'ok', selectedValue: options.value })} color='primary'>OK</Button>
      </DialogActions>

    </Dialog>
  );
};

YearSelectorDialog.propTypes = {
  show: PropTypes.bool,
  proceed: PropTypes.func,
  options: PropTypes.object
};

const selectorDialog = dialogs.create(YearSelectorDialog);

const YearSelectorButton = React.forwardRef(({ value, onChange, selectLastDay, ...props }, ref) => {

  const clickHandler = async () => {
    const { result, selectedValue } = await selectorDialog({ options: { value } });
    if(result !== 'ok') {
      return;
    }

    onChange(getSelectedDate(selectedValue, selectLastDay));
  };

  return (
    <Tooltip title='Sélection par année'>
      <div>
        <IconButton ref={ref} onClick={clickHandler} {...props}>
          <CalendarTodayIcon />
        </IconButton>
      </div>
    </Tooltip>
  );
});

YearSelectorButton.displayName = 'YearSelectorButton';

YearSelectorButton.propTypes = {
  value: PropTypes.instanceOf(Date),
  onChange: PropTypes.func.isRequired,
  selectLastDay: PropTypes.bool
};

export default YearSelectorButton;

function getSelectedDate(selectedValue, selectLastDay) {
  if(!selectedValue) {
    return null;
  }
  return selectLastDay ? lastDayOfYear(selectedValue) : firstDayOfYear(selectedValue);
}

function firstDayOfYear(date) {
  return new Date(date.getFullYear(), 0, 1);
}

function lastDayOfYear(date) {
  return new Date(date.getFullYear(), 11, 31);
}

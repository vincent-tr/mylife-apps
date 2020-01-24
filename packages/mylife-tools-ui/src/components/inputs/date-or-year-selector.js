'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import { DatePicker } from '@material-ui/pickers';

import YearSelectorButton from './year-selector-button';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  input: {
    width: 100
  },
  button: {
  }
});

const pickerOptions = {
  clearable: true,
  autoOk: true,
  format: 'dd/MM/yyyy',
  cancelLabel: 'Annuler',
  clearLabel: 'Aucun'
};

const DateOrYearSelector = ({ disabled, onChange, value, showYearSelector, selectLastDay, ...props }) => {
  const classes = useStyles();
  return (
    <div className={classes.container} {...props}>
      <DatePicker disabled={disabled} className={classes.input} value={value} onChange={onChange} {...pickerOptions} />
      {showYearSelector && (<YearSelectorButton disabled={disabled} className={classes.button} value={value} onChange={onChange} selectLastDay={selectLastDay} />)}
    </div>
  );
};

DateOrYearSelector.propTypes = {
  disabled: PropTypes.bool,
  value: PropTypes.instanceOf(Date),
  onChange: PropTypes.func.isRequired,
  showYearSelector: PropTypes.bool,
  selectLastDay: PropTypes.bool
};

export default DateOrYearSelector;

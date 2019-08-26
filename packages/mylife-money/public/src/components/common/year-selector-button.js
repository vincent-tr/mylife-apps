'use strict';

import { React, PropTypes, mui, dialogs } from 'mylife-tools-ui';
import icons from '../icons';


const YearSelectorDialog = ({ show, proceed, options }) => (
  <mui.Dialog aria-labelledby='dialog-title' open={show}>
    <mui.DialogTitle id='dialog-title'>
      Sélectionnez un groupe
    </mui.DialogTitle>

    <mui.DialogContent dividers>
      <mui.DatePicker autoOk variant='static' views={['year']} value={options.value} onChange={selectedValue => proceed({ result: 'ok', selectedValue })} />
    </mui.DialogContent>

    <mui.DialogActions>
      <mui.Button onClick={() => proceed({ result: 'ok', selectedValue: null })}>Aucun</mui.Button>
      <mui.Button onClick={() => proceed({ result: 'cancel' })}>Annuler</mui.Button>
    </mui.DialogActions>

  </mui.Dialog>
);

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
    <mui.Tooltip title='Sélection par année'>
      <div>
        <mui.IconButton ref={ref} onClick={clickHandler} {...props}>
          <icons.actions.Date />
        </mui.IconButton>
      </div>
    </mui.Tooltip>
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

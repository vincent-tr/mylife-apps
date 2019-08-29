'use strict';

import { React, PropTypes, mui, dialogs } from 'mylife-tools-ui';
import icons from '../icons';


const useStyles = mui.makeStyles({
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
    <mui.Dialog open={show} onClose={() => proceed({ result: 'cancel' })} >
      <mui.DialogContent dividers>
        <mui.DatePicker autoOk variant='static' views={['year']} value={options.value} onChange={selectedValue => proceed({ result: 'ok', selectedValue })} />
      </mui.DialogContent>

      <mui.DialogActions classes={{ root: classes.actions }}>
        <mui.Button onClick={() => proceed({ result: 'ok', selectedValue: null })} color='primary'>Aucun</mui.Button>
        <mui.Button onClick={() => proceed({ result: 'cancel' })} color='primary'>Annuler</mui.Button>
        <mui.Button onClick={() => proceed({ result: 'ok', selectedValue: options.value })} color='primary'>OK</mui.Button>
      </mui.DialogActions>

    </mui.Dialog>
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

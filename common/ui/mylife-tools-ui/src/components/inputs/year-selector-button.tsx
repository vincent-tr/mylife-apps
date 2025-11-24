import React from 'react';
import PropTypes from 'prop-types';
import * as dialogs from '../../modules/dialogs/helpers';
import { Dialog, DialogContent, DialogActions, Button, Tooltip, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { DatePicker } from '@mui/x-date-pickers';
import { CalendarToday } from '@mui/icons-material';

const StyledDialogActions = styled(DialogActions)({
  // https://github.com/mui-org/material-ui-pickers/blob/next/lib/src/_shared/ModalDialog.tsx
  justifyContent: 'flex-start',

  '& > *:first-child': {
    marginRight: 'auto',
  },
});

interface YearSelectorDialogProps {
  show: boolean;
  proceed: (result: { result: 'ok' | 'cancel'; selectedValue?: Date }) => void;
  options: { value: Date };
}

const YearSelectorDialog: React.FC<YearSelectorDialogProps> = ({ show, proceed, options }) => {
  return (
    <Dialog open={show} onClose={() => proceed({ result: 'cancel' })} >
      <DialogContent dividers>
        <DatePicker 
          views={['year']} 
          value={options.value} 
          onChange={selectedValue => proceed({ result: 'ok', selectedValue })}
          slotProps={{
            actionBar: {
              actions: []
            }
          }}
        />
      </DialogContent>

      <StyledDialogActions>
        <Button onClick={() => proceed({ result: 'ok', selectedValue: null })} color='primary'>Aucun</Button>
        <Button onClick={() => proceed({ result: 'cancel' })} color='primary'>Annuler</Button>
        <Button onClick={() => proceed({ result: 'ok', selectedValue: options.value })} color='primary'>OK</Button>
      </StyledDialogActions>

    </Dialog>
  );
};

const selectorDialog = dialogs.create(YearSelectorDialog);

interface YearSelectorButtonProps {
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  value: Date;
  onChange: (value: Date) => void;
  selectLastDay?: boolean;
}

const YearSelectorButton = React.forwardRef<HTMLButtonElement, YearSelectorButtonProps>(({ value, onChange, selectLastDay = false, ...props }, ref) => {

  const clickHandler = async () => {
    const response = await selectorDialog({ options: { value } }) as { result: 'ok' | 'cancel'; selectedValue?: Date };
    const { result, selectedValue } = response;
    if(result !== 'ok') {
      return;
    }

    onChange(getSelectedDate(selectedValue, selectLastDay));
  };

  return (
    <Tooltip title='Sélection par année'>
      <div>
        <IconButton ref={ref} onClick={clickHandler} {...props}>
          <CalendarToday />
        </IconButton>
      </div>
    </Tooltip>
  );
});

YearSelectorButton.displayName = 'YearSelectorButton';

export default YearSelectorButton;

function getSelectedDate(selectedValue: Date, selectLastDay: boolean) {
  if (!selectedValue) {
    return null;
  }
  
  return selectLastDay ? lastDayOfYear(selectedValue) : firstDayOfYear(selectedValue);
}

function firstDayOfYear(date: Date) {
  return new Date(date.getFullYear(), 0, 1);
}

function lastDayOfYear(date: Date) {
  return new Date(date.getFullYear(), 11, 31);
}

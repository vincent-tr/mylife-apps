'use strict';

import { React, PropTypes, useMemo, mui, useDispatch, DebouncedTextField } from 'mylife-tools-ui';
import { updateDocument } from '../../actions';
import { getFieldName } from '../../../common/metadata-utils';

const useConnect = () => {
  const dispatch = useDispatch();
  return useMemo(() => ({
    updateDocument : (document, values) => dispatch(updateDocument(document, values)),
  }), [dispatch]);
};

const useStyles = mui.makeStyles({
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
  format: 'dd/MM/yyyy HH:mm:ss',
  cancelLabel: 'Annuler',
  clearLabel: 'Aucun'
};

const DetailDate = ({ document }) => {
  const classes = useStyles();
  const { updateDocument } = useConnect();
  const onChange = value => updateDocument(document, { date: value });
  const resetDate = document.metadata.date;
  const canReset = resetDate !== null && !dateEquals(resetDate, document.date);

  return (
    <mui.ListItem>
      <mui.ListItemText
        disableTypography
        primary={
          <mui.Typography>{getName(document)}</mui.Typography>
        }
        secondary={
          <div className={classes.container}>
            <mui.DateTimePicker className={classes.input} value={document.date} onChange={onChange} {...pickerOptions} />
            {canReset && (
              <mui.Tooltip title={'reset to TOTO date'}>
                <mui.IconButton className={classes.button} onClick={() => onChange(resetDate)}>
                  <mui.icons.Add />
                </mui.IconButton>
              </mui.Tooltip>
            )}
          </div>
        } />
    </mui.ListItem>
  );
};

DetailDate.propTypes = {
  document: PropTypes.object.isRequired
};

export default DetailDate;

function getName(document) {
  return getFieldName(document._entity, 'date');
}

function dateEquals(date1, date2) {
  if(date1 === null && date2 === null) {
    return true;
  }
  if(date1 === null || date2 === null) {
    return false;
  }

  return date1.valueOf() === date2.valueOf();
}

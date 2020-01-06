'use strict';

import { React, PropTypes, mui, useState, useMemo, useDispatch, useSelector, useLifecycle, dialogs, immutable } from 'mylife-tools-ui';
import { enterCleanOthersDialog, leaveCleanDialog } from '../../actions';
import { getCleanDocuments } from '../../selectors';
import CleanDialogBase from './../clean-dialog-base';
import List from './list';

const useConnect = () => {
  const dispatch = useDispatch();
  return {
    ...useSelector(state => ({
      documents : getCleanDocuments(state),
    })),
    ...useMemo(() => ({
      enter : () => dispatch(enterCleanOthersDialog()),
      leave : () => dispatch(leaveCleanDialog()),
    }), [dispatch])
  };
};

const useStyles = mui.makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  list: {
    flex: '1 1 auto',
  }
});

// TODO: Stepper

const CleanOthersDialog = ({ show, proceed }) => {
  const classes = useStyles();
  const { enter, leave, documents } = useConnect();
  useLifecycle(enter, leave);
  const [selection, setSelection] = useState(new immutable.Set());


  return (
    <CleanDialogBase show={show} onClose={proceed} title={'Nettoyage des documents \'autres\''} className={classes.container}>
      {documents && (
        <List documents={documents} selection={selection} setSelection={setSelection} className={classes.list} />
      )}
    </CleanDialogBase>
  );
};

CleanOthersDialog.propTypes = {
  show: PropTypes.bool.isRequired,
  proceed: PropTypes.func.isRequired
};

const dialog = dialogs.create(CleanOthersDialog);

export async function showDialog() {
  await dialog();
}

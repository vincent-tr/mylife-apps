'use strict';

import { React, PropTypes, mui, useMemo, useDispatch, useSelector, useLifecycle, dialogs } from 'mylife-tools-ui';
import { enterCleanDuplicatesDialog, leaveCleanDialog } from '../actions';
import { getCleanDocuments } from '../selectors';

const useConnect = () => {
  const dispatch = useDispatch();
  return {
    ...useSelector(state => ({
      documents : getCleanDocuments(state),
    })),
    ...useMemo(() => ({
      enter : () => dispatch(enterCleanDuplicatesDialog()),
      leave : () => dispatch(leaveCleanDialog()),
    }), [dispatch])
  };
};

const CleanDuplicatesDialog = ({ show, proceed }) => {
  const { enter, leave, documents } = useConnect();
  useLifecycle(enter, leave);

  return (
    <mui.Dialog open={show} onClose={proceed} fullWidth maxWidth='xl'>
      <mui.DialogTitle>
        {'Nettoyage des documents \'autres\''}
      </mui.DialogTitle>
      <mui.DialogContent>
        {JSON.stringify(documents)}
      </mui.DialogContent>
      <mui.DialogActions>
        <mui.Button onClick={proceed} color='primary'>
          Fermer
        </mui.Button>
      </mui.DialogActions>
    </mui.Dialog>
  );
};

CleanDuplicatesDialog.propTypes = {
  show: PropTypes.bool.isRequired,
  proceed: PropTypes.func.isRequired
};

const dialog = dialogs.create(CleanDuplicatesDialog);

export async function showDialog() {
  await dialog();
}

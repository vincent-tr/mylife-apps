'use strict';

import { React, PropTypes, mui, useMemo, useDispatch, useSelector, useLifecycle, dialogs } from 'mylife-tools-ui';
import CleanDialogBase from './clean-dialog-base';
import { enterCleanOthersDialog, leaveCleanDialog } from '../actions';
import { getCleanDocuments } from '../selectors';

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

const CleanOthersDialog = ({ show, proceed }) => {
  const { enter, leave, documents } = useConnect();
  useLifecycle(enter, leave);

  return (
    <CleanDialogBase show={show} onClose={proceed} title={'Nettoyage des documents \'autres\''}>
      {JSON.stringify(documents)}
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

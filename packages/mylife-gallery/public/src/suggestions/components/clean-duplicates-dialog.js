'use strict';

import { React, PropTypes, mui, useMemo, useDispatch, useSelector, useLifecycle, dialogs } from 'mylife-tools-ui';
import CleanDialogBase from './clean-dialog-base';
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
    <CleanDialogBase show={show} onClose={proceed} title={'Nettoyage des documents en doublons'}>
      {JSON.stringify(documents)}
    </CleanDialogBase>
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
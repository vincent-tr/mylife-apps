import { React, PropTypes, useState, useMemo, useDispatch, useSelector, useLifecycle, dialogs, immutable, DeleteButton } from 'mylife-tools-ui';
import { enterDeleteLoadingErrorsDialog, leaveDialog, deleteLoadingErrors } from '../../actions';
import { getDialogObjects } from '../../selectors';
import DialogBase from './dialog-base';
import DeleteLoadingErrorsList from './clean-others-list';
import useStyles from './styles';

type FIXME_any = any;

const useConnect = () => {
  const dispatch = useDispatch<FIXME_any>();
  return {
    ...useSelector(state => ({
      documents : getDialogObjects(state),
    })),
    ...useMemo(() => ({
      enter : () => dispatch(enterDeleteLoadingErrorsDialog()),
      leave : () => dispatch(leaveDialog()),
      deleteLoadingErrors : (ids) => dispatch(deleteLoadingErrors(ids)),
    }), [dispatch])
  };
};

const DeleteLoadingErrorsDialog = ({ show, proceed }) => {
  const classes = useStyles();
  const { enter, leave, documents, deleteLoadingErrors } = useConnect();
  useLifecycle(enter, leave);
  const [selection, setSelection] = useState(immutable.Set());

  const onDelete = () => {
    deleteLoadingErrors(selection.toArray());
    proceed();
  };

  return (
    <DialogBase
      show={show}
      onClose={proceed}
      title={'Ré-intégration de documents en erreur'}
      actions={
        <DeleteButton
          disabled={selection.size === 0}
          tooltip={'Supprimer les documents pour ré-integration'}
          icon
          text='Ré-intégrer'
          confirmText={`Etes-vous sûr de vouloir supprimer ${selection.size} document(s) pour réintegration ?`}
          onConfirmed={onDelete}
          disablePortal
        />
      }
    >
      {documents && (
        <DeleteLoadingErrorsList documents={documents} onClose={proceed} selection={selection} setSelection={setSelection} className={classes.list}/>
      )}
    </DialogBase>
  );
};

DeleteLoadingErrorsDialog.propTypes = {
  show: PropTypes.bool.isRequired,
  proceed: PropTypes.func.isRequired
};

const dialog = dialogs.create(DeleteLoadingErrorsDialog);

export async function showDialog() {
  await dialog();
}

'use strict';

import { React, PropTypes, useState, useMemo, useDispatch, useSelector, useLifecycle, dialogs, immutable, StepperControl } from 'mylife-tools-ui';
import { enterMoveSortedDocumentsDialog, leaveDialog } from '../../actions';
import { getDialogObjects } from '../../selectors';
import DialogBase from './dialog-base';
import MoveSortedDocumentsList from './move-sorted-documents-list';
import ScriptGenerator from './script-generator';
import useStyles from './styles';
import { getPath } from './move-sorted-documents-tools';

const useConnect = () => {
  const dispatch = useDispatch();
  return {
    ...useSelector(state => ({
      documents : getDialogObjects(state),
    })),
    ...useMemo(() => ({
      enter : (albumId) => dispatch(enterMoveSortedDocumentsDialog(albumId)),
      leave : () => dispatch(leaveDialog()),
    }), [dispatch])
  };
};

const Stepper = ({ title, documents, onClose }) => {
  const classes = useStyles();
  const [selection, setSelection] = useState(new immutable.Set());

  const renderList = () => (<MoveSortedDocumentsList documents={documents} selection={selection} setSelection={setSelection} className={classes.list} />);
  const renderGenerator = () => (<ScriptGenerator paths={generatePaths(documents, selection)} />);

  const steps = [
    { label: `Sélection des documents à déplacer pour l'album '${title}'`, render: renderList, actions: { canNext: selection.size > 0 } },
    { label: 'Génération du script', render: renderGenerator }
  ];

  return (
    <StepperControl steps={steps} onEnd={onClose} className={classes.content} />
  );
};

Stepper.propTypes = {
  title: PropTypes.string.isRequired,
  documents: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired
};

const MoveSortedDocumentsDialog = ({ show, proceed, options }) => {
  const { enter, leave, documents } = useConnect();
  useLifecycle(() => enter(options.id), leave);

  return (
    <DialogBase show={show} onClose={proceed} title={'Déplacement des documents triés'}>
      {documents && (
        <Stepper title={options.title} documents={documents} onClose={proceed} />
      )}
    </DialogBase>
  );
};

MoveSortedDocumentsDialog.propTypes = {
  options: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  proceed: PropTypes.func.isRequired
};

const dialog = dialogs.create(MoveSortedDocumentsDialog);

export async function showDialog({ id, title }) {
  await dialog({ options: { title, id } });
}

function generatePaths(documents, selection) {
  return documents.filter(doc => selection.has(doc._id)).map(getPath);
}

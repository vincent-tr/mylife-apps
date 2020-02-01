'use strict';

import { React, PropTypes, useState, useMemo, useDispatch, useSelector, useLifecycle, dialogs, immutable, StepperControl } from 'mylife-tools-ui';
import { enterCleanOthersDialog, leaveDialog } from '../../actions';
import { getDialogObjects } from '../../selectors';
import DialogBase from './dialog-base';
import CleanOthersList from './clean-others-list';
import ScriptGenerator from './script-generator';
import useStyles from './styles';

const useConnect = () => {
  const dispatch = useDispatch();
  return {
    ...useSelector(state => ({
      documents : getDialogObjects(state),
    })),
    ...useMemo(() => ({
      enter : () => dispatch(enterCleanOthersDialog()),
      leave : () => dispatch(leaveDialog()),
    }), [dispatch])
  };
};

const Stepper = ({ documents, onClose }) => {
  const classes = useStyles();
  const [selection, setSelection] = useState(new immutable.Set());

  const renderList = () => (<CleanOthersList documents={documents} selection={selection} setSelection={setSelection} className={classes.list} />);
  const renderGenerator = () => (<ScriptGenerator paths={generatePaths(documents, selection)} template={'Remove-Item -path "${file}" -whatif\n'} />);

  const steps = [
    { label: 'Sélection des documents à supprimer', render: renderList, actions: { canNext: selection.size > 0 } },
    { label: 'Génération du script', render: renderGenerator }
  ];

  return (
    <StepperControl steps={steps} onEnd={onClose} className={classes.content} />
  );
};

Stepper.propTypes = {
  documents: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired
};

const CleanOthersDialog = ({ show, proceed }) => {
  const { enter, leave, documents } = useConnect();
  useLifecycle(enter, leave);

  return (
    <DialogBase show={show} onClose={proceed} title={'Nettoyage des documents \'autres\''}>
      {documents && (
        <Stepper documents={documents} onClose={proceed} />
      )}
    </DialogBase>
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

function generatePaths(documents, selection) {
  const paths = [];
  for(const document of documents.filter(doc => selection.has(doc._id))) {
    for(const { path } of document.paths) {
      paths.push(path);
    }
  }
  return paths;
}

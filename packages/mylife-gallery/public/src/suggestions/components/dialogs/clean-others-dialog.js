'use strict';

import { React, PropTypes, mui, useState, useMemo, useDispatch, useSelector, useLifecycle, dialogs, immutable, StepperControl } from 'mylife-tools-ui';
import { enterCleanOthersDialog, leaveCleanDialog } from '../../actions';
import { getCleanDocuments } from '../../selectors';
import DialogBase from './dialog-base';
import CleanOthersList from './clean-others-list';
import ScriptGenerator from './script-generator';

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
  content: {
    flex: '1 1 auto',
  },
  list: {
    width: '100%',
    height: '100%',
  },
  generator: {
    width: '100%',
    height: '100%',
  }
});

const Stepper = ({ documents, onClose, ...props }) => {
  const classes = useStyles();
  const [selection, setSelection] = useState(new immutable.Set());

  const renderList = () => (<CleanOthersList documents={documents} selection={selection} setSelection={setSelection} className={classes.list}/>);
  const renderGenerator = () => (<ScriptGenerator documents={documents.filter(doc => selection.has(doc._id))} className={classes.generator}/>);

  const steps = [
    { label: 'Sélection des documents', render: renderList, actions: { canNext: selection.size > 0 } },
    { label: 'Génération du script', render: renderGenerator }
  ];

  return (
    <StepperControl steps={steps} onEnd={onClose} {...props} />
  );
};

Stepper.propTypes = {
  documents: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired
};

const CleanOthersDialog = ({ show, proceed }) => {
  const classes = useStyles();
  const { enter, leave, documents } = useConnect();
  useLifecycle(enter, leave);

  return (
    <DialogBase show={show} onClose={proceed} title={'Nettoyage des documents \'autres\''} className={classes.container}>
      {documents && (
        <Stepper documents={documents} onClose={proceed} className={classes.content} />
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

import { React, PropTypes, useState, useMemo, useEffect, useDispatch, useSelector, useLifecycle, dialogs, immutable, StepperControl } from 'mylife-tools-ui';
import { enterCleanDuplicatesDialog, leaveDialog } from '../../actions';
import { getDialogObjects } from '../../selectors';
import DialogBase from './dialog-base';
import CleanDuplicatesList from './clean-duplicates-list';
import ScriptGenerator from './script-generator';
import useStyles from './styles';

type FIXME_any = any;

const useConnect = () => {
  const dispatch = useDispatch<FIXME_any>();
  return {
    ...useSelector(state => ({
      documents : getDialogObjects(state),
    })),
    ...useMemo(() => ({
      enter : () => dispatch(enterCleanDuplicatesDialog()),
      leave : () => dispatch(leaveDialog()),
    }), [dispatch])
  };
};

const Stepper = ({ documents, onClose }) => {
  const classes = useStyles();
  const [selection, setSelection] = useState(immutable.Map());
  useEffect(() => setSelection(getInitialSelection(documents)), [documents]);

  const renderList = () => (<CleanDuplicatesList documents={documents} selection={selection} setSelection={setSelection} className={classes.list} />);
  const renderGenerator = () => (<ScriptGenerator paths={generatePaths(documents, selection)} template={'Remove-Item -path "${file}" -whatif\n'} />);

  const steps = [
    { label: 'Sélection des documents à conserver', render: renderList, actions: { canNext: selection.size > 0 } },
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

const CleanDuplicatesDialog = ({ show, proceed }) => {
  const { enter, leave, documents } = useConnect();
  useLifecycle(enter, leave);

  return (
    <DialogBase show={show} onClose={proceed} title={'Nettoyage des documents en doublons'}>
      {documents && (
        <Stepper documents={documents} onClose={proceed} />
      )}
    </DialogBase>
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

function getInitialSelection(documents) {
  return immutable.Map().withMutations(map => {
    for(const document of documents) {
      // if a document has one path with does not start with _, then select it by default
      const indexes = [];
      for(const [index, { path }] of document.paths.entries()) {
        if(!path.startsWith('_')) {
          indexes.push(index);
        }
      }

      if(indexes.length === 1) {
        map.set(document._id, indexes[0]);
      }
    }
  });
}

function generatePaths(documents, selection) {
  const paths = [];

  // for each document which has a selection, collection unselected paths
  for(const document of documents) {
    const selectedIndex = selection.get(document._id);
    if(selectedIndex === undefined) {
      continue;
    }

    for(const [index, { path }] of document.paths.entries()) {
      if(index === selectedIndex) {
        continue;
      }

      paths.push(path);
    }
  }

  return paths;
}

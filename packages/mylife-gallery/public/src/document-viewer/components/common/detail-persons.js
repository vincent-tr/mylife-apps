'use strict';

import { React, PropTypes, useMemo, mui, useState, useDispatch, dialogs } from 'mylife-tools-ui';
import { usePersonView, personComparer } from '../../../common/person-view';
import { renderObject } from '../../../common/metadata-utils';
import { addPersonToDocument, removePersonFromDocument, createPersonWithDocument } from '../../actions';

const useConnect = () => {
  const dispatch = useDispatch();
  return useMemo(() => ({
    createPerson: (document, firstName, lastName) => dispatch(createPersonWithDocument(document, firstName, lastName)),
    addPerson : (document, person) => dispatch(addPersonToDocument(document, person)),
    removePerson : (document, person) => dispatch(removePersonFromDocument(document, person)),
  }), [dispatch]);
};

const useStyles = mui.makeStyles(theme => ({
  list: {
    width: 300,
    height: 180,
    overflow: 'auto'
  },
  addButton: {
    marginLeft: theme.spacing(1),
    color: theme.status.success
  },
  deleteButton: {
    marginLeft: theme.spacing(1),
    color: theme.status.error
  }
}));

const PersonAddDialog = ({ show, proceed }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  return (
    <mui.Dialog aria-labelledby='dialog-title' open={show} scroll='paper' maxWidth='sm' fullWidth>
      <mui.DialogTitle id='dialog-title'>
        {'Informations de la nouvelle personne'}
      </mui.DialogTitle>

      <mui.DialogContent dividers>
        <mui.DialogContentText>{'Prénom'}</mui.DialogContentText>
        <mui.TextField autoFocus fullWidth value={firstName} onChange={e => setFirstName(e.target.value)} />
        <mui.DialogContentText>{'Nom'}</mui.DialogContentText>
        <mui.TextField fullWidth value={lastName} onChange={e => setLastName(e.target.value)} />
      </mui.DialogContent>

      <mui.DialogActions>
        <mui.Button color='primary' onClick={() => proceed({ result: 'ok', firstName, lastName })}>OK</mui.Button>
        <mui.Button onClick={() => proceed({ result: 'cancel' })}>Annuler</mui.Button>
      </mui.DialogActions>
    </mui.Dialog>
  );
};

PersonAddDialog.propTypes = {
  show: PropTypes.bool,
  proceed: PropTypes.func
};

const personAddDialog = dialogs.create(PersonAddDialog);

const useAddButtonStyles = mui.makeStyles(theme => ({
  listAddIcon: {
    marginRight: theme.spacing(1),
    color: theme.status.success
  }
}));

const AddButton = ({ persons, addPerson, createPerson, ...props }) => {
  const classes = useAddButtonStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const onOpen = event => setAnchorEl(event.currentTarget);
  const onClose = () => setAnchorEl(null);

  const onAdd = (person) => {
    onClose();
    addPerson(person);
  };

  const onNew = async () => {
    onClose();

    const { result, firstName, lastName } = await personAddDialog();
    if(result !== 'ok') {
      return;
    }

    createPerson(firstName, lastName);
  };

  return (
    <>
    <mui.Tooltip title='Ajouter une personne à un document'>
      <mui.IconButton {...props} onClick={onOpen}>
        <mui.icons.AddCircle />
      </mui.IconButton>
    </mui.Tooltip>
    <mui.Menu
      anchorEl={anchorEl}
      open={!!anchorEl}
      onClose={onClose}
    >
      <mui.MenuItem onClick={onNew}>
        <mui.icons.AddCircle className={classes.listAddIcon}/>
        Nouvelle personne ...
      </mui.MenuItem>
      {persons.map(person => (
        <mui.MenuItem key={person._id} onClick={() => onAdd(person)}>{renderObject(person)}</mui.MenuItem>
      ))}
    </mui.Menu>
    </>
  );
};

AddButton.propTypes = {
  persons: PropTypes.array.isRequired,
  addPerson: PropTypes.func.isRequired,
  createPerson: PropTypes.func.isRequired
};

const DetailPersons = ({ documentWithInfo }) => {
  const classes = useStyles();
  const { persons, personView } = usePersonView();
  const { addPerson, removePerson, createPerson } = useConnect();

  const { document } = documentWithInfo;
  const personIds = document.persons;

  const addablePersons = useMemo(() => {
    // the same document cannot be added twice in an person
    const idSet = new Set(personIds);
    return persons.filter(person => !idSet.has(person._id));
  }, [personIds, persons]);

  const personList = useMemo(() => {
    const list = [];
    for(const id of personIds) {
      const person = personView.get(id);
      if(!person) {
        // personView not ready
        continue;
      }

      list.push(person);
    }

    list.sort(personComparer);
    return list;
  }, [personIds, personView]);

  return (
    <mui.ListItem>
      <mui.ListItemText
        disableTypography
        primary={
          <mui.Typography>
            {'Personnes'}
            <AddButton
              persons={addablePersons}
              addPerson={person => addPerson(document, person)}
              createPerson={(firstName, lastName) => createPerson(document, firstName, lastName)}
              className={classes.addButton}
            />
          </mui.Typography>
        }
        secondary={
          <mui.List className={classes.list} dense>
            {personList.map(person => (
              <mui.ListItem key={person._id}>
                <mui.Typography>
                  {person.firstName} {person.lastName}
                </mui.Typography>
                <mui.Tooltip title={'Enlever la personne du document'}>
                  <mui.IconButton className={classes.deleteButton} onClick={() => removePerson(document, person)}>
                    <mui.icons.Delete />
                  </mui.IconButton>
                </mui.Tooltip>
              </mui.ListItem>
            ))}
          </mui.List>
        }
      />
    </mui.ListItem>
  );
};

DetailPersons.propTypes = {
  documentWithInfo: PropTypes.object.isRequired
};

export default DetailPersons;

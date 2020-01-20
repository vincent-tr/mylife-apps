'use strict';

import { React, PropTypes, useMemo, mui, useDispatch, dialogs } from 'mylife-tools-ui';
import { usePersonView } from '../../../common/person-view';
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

    const { result, text: title } = await dialogs.input({ title: 'Titre du nouvel person', label: 'Titre' });
    if(result !== 'ok') {
      return;
    }

    createPerson(firstName, lastName);
  };

  return (
    <>
    <mui.Tooltip title='Ajouter le document à un person'>
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
        Nouvel person ...
      </mui.MenuItem>
      {persons.map(person => (
        <mui.MenuItem key={person._id} onClick={() => onAdd(person)}>{person.title}</mui.MenuItem>
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

  const { document, info } = documentWithInfo;
  const personIds = info.persons.map(item => item.id);

  const addablePersons = useMemo(() => {
    // the same document cannot be added twice in an person
    const idSet = new Set(personIds);
    return persons.filter(person => !idSet.has(person._id));
  }, [personIds, persons]);

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
            {personIds.map(id => {
              const person = personView.get(id);
              if(!person) { // personView not ready
                return null;
              }

              return (
                <mui.ListItem key={id}>
                  <mui.Typography>
                    {person.title}
                  </mui.Typography>
                  <mui.Tooltip title={'Enlever la personne du document'}>
                    <mui.IconButton className={classes.deleteButton} onClick={() => removePerson(document, person)}>
                      <mui.icons.Delete />
                    </mui.IconButton>
                  </mui.Tooltip>
                </mui.ListItem>
              );
            })}
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

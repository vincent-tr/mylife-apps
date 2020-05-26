'use strict';

import { React, PropTypes, immutable, mui, useState, useDispatch, useMemo } from 'mylife-tools-ui';
import { usePersonView } from '../../common/shared-views';
import icons from '../../common/icons';
import { savePersons } from '../actions';
import HeaderObjects from './header-objects';

const useConnect = () => {
  const dispatch = useDispatch();
  return useMemo(() => ({
    savePersons: (documents, data) => dispatch(savePersons(documents, data))
  }), [dispatch]);
};

const useStyles = mui.makeStyles(theme => ({
  inputsContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputSeparator: {
    width: '100%',
    height: theme.spacing(1)
  },
  addButton: {
    color: theme.palette.success.main
  }
}));

const ENTER_KEY = 13;

const NewPerson = ({ onNew }) => {
  const classes = useStyles();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const onValidate = () => {
    if(!firstName || !lastName) {
      return;
    }

    onNew({ firstName, lastName });
    setFirstName('');
    setLastName('');
  };

  const handleKeyDown = e => {
    if (e.keyCode === ENTER_KEY) {
      onValidate();
    }
  };

  return (
    <mui.ListItem>

      <mui.ListItemText primary={
        <div className={classes.inputsContainer}>
          <mui.TextField
            fullWidth
            placeholder={'Prénom'}
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className={classes.inputSeparator} />
          <mui.TextField
            fullWidth
            placeholder={'Nom'}
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
      } />

      <mui.ListItemSecondaryAction>
        <mui.IconButton edge='end' className={classes.addButton} onClick={onValidate} disabled={!firstName || !lastName}>
          <mui.icons.AddCircle />
        </mui.IconButton>
      </mui.ListItemSecondaryAction>

    </mui.ListItem>
  );
};

NewPerson.propTypes = {
  onNew: PropTypes.func.isRequired
};

const HeaderPersons = ({ documents }) => {
  const { persons } = usePersonView();
  const { savePersons } = useConnect();

  return (
    <HeaderObjects
      title={'Personnes'}
      icon={<icons.menu.Person />}
      newObject={NewPerson}
      newObjectRenderer={({ firstName, lastName }) => `${firstName} ${lastName}`}
      documents={documents}
      objects={persons}
      onSave={data => savePersons(documents.map(docWithInfo => docWithInfo.document), data)}
      getObjectUsage={getInitialPersonUsage}
    />
  );
};

HeaderPersons.propTypes = {
  documents: PropTypes.array.isRequired
};

export default HeaderPersons;

function getInitialPersonUsage(documents) {
  const persons = new Map();
  for(const { document } of documents) {
    for(const personId of document.persons || []) {
      let documents = persons.get(personId);
      if(!documents) {
        documents = new Set();
        persons.set(personId, documents);
      }

      documents.add(document);
    }
  }
  const entries = Array.from(persons.entries());
  const setEntries = entries.map(([personId, documents]) => [personId, new immutable.Set(documents)]);
  return new immutable.Map(setEntries);
}

import { React, useMemo, mui, useDispatch } from 'mylife-tools-ui';
import { usePersonView } from '../../common/shared-views';
import { personAddDialog } from '../../common/person-add-dialog';
import { createPerson } from '../actions';
import ListItem from './list-item';

type FIXME_any = any;

const useConnect = () => {
  const dispatch = useDispatch<FIXME_any>();
  return useMemo(() => ({
    createPerson: (firstName, lastName) => dispatch(createPerson(firstName, lastName)),
  }), [dispatch]);
};

const useStyles = mui.makeStyles(theme => ({
  main: {
    flex: '1 1 auto',
    overflowY: 'auto'
  },
  addButton: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  }
}));

const Persons = () => {
  const classes = useStyles();
  const { persons } = usePersonView();
  const { createPerson } = useConnect();

  const onAdd = async () => {
    const { result, firstName, lastName } = await personAddDialog();
    if(result !== 'ok') {
      return;
    }

    createPerson(firstName, lastName);
  };

  return (
    <>
      <mui.List className={classes.main}>
        {persons.map(person => (
          <ListItem key={person._id} person={person} />
        ))}
      </mui.List>
      <mui.Tooltip title='Nouvelle personne'>
        <mui.Fab color='primary' className={classes.addButton} onClick={onAdd}>
          <mui.icons.Add />
        </mui.Fab>
      </mui.Tooltip>
    </>
  );
};

export default Persons;

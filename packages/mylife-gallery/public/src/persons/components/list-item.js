'use strict';

import { React, PropTypes, mui, useDispatch, useMemo, DebouncedTextField, DeleteButton } from 'mylife-tools-ui';
import { renderObject } from '../../common/metadata-utils';
import { ThumbnailPerson } from '../../common/thumbnail';
import { updatePerson, deletePerson } from '../actions';

const useStyles = mui.makeStyles(theme => ({
  panel: {
    width: '100%',
  },
  container: {
    width: '100%',
    maxWidth: 900,
    display: 'flex',
    alignItems: 'center',
    '& > *': {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
  },
  grid: {
    width: 650
  },
  editor: {
    width: 200
  },
  runButton: {
    marginTop: theme.spacing(8)
  }
}));

const useConnect = () => {
  const dispatch = useDispatch();
  return {
    ...useMemo(() => ({
      updatePerson: (person, values) => dispatch(updatePerson(person, values)),
      deletePerson: (id) => dispatch(deletePerson(id)),
    }), [dispatch])
  };
};

const ListItem = ({ person, ...props }) => {
  const classes = useStyles();
  const { updatePerson, deletePerson } = useConnect();
  const onUpdate = (prop, value) => updatePerson(person, { [prop]: value });
  const onDelete = () => deletePerson(person._id);

  return (
    <mui.ListItem {...props}>
      <mui.Grid container spacing={2} className={classes.grid}>
        <mui.Grid item xs={6}>
          <mui.Typography>Prénom</mui.Typography>
        </mui.Grid>
        <mui.Grid item xs={6}>
          <DebouncedTextField value={person.firstName} onChange={(value) => onUpdate('firstName', value)} className={classes.editor} />
        </mui.Grid>
        <mui.Grid item xs={6}>
          <mui.Typography>Nom</mui.Typography>
        </mui.Grid>
        <mui.Grid item xs={6}>
          <DebouncedTextField value={person.lastName} onChange={(value) => onUpdate('lastName', value)} className={classes.editor} />
        </mui.Grid>
        <mui.Grid item xs={12} justify='center' container>
          <DeleteButton
            tooltip={'Supprimer la personne'}
            icon
            text='Supprimer'
            confirmText={`Etes-vous sûr de vouloir supprimer la personne '${renderObject(person)}' ?`}
            onConfirmed={onDelete}
          />
        </mui.Grid>
      </mui.Grid>
      <ThumbnailPerson person={person} />
    </mui.ListItem>
  );
};

ListItem.propTypes = {
  person: PropTypes.object.isRequired
};

export default ListItem;

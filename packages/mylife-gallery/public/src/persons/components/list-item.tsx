'use strict';

import { React, PropTypes, mui, useDispatch, useMemo, DebouncedTextField, DeleteButton, services } from 'mylife-tools-ui';
import { ThumbnailPerson, THUMBNAIL_SIZE } from '../../common/thumbnail';
import { updatePerson, deletePerson } from '../actions';
import { thumbnailSelectorDialog } from './thumbnail-selector-dialog';

const useStyles = mui.makeStyles(theme => ({
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
  thumbnail: {
    // size + position
    height: THUMBNAIL_SIZE,
    width: THUMBNAIL_SIZE,
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),

    // border
    borderWidth: 1,
    borderColor: mui.colors.grey[300],
    borderStyle: 'solid',

    // cursor
    cursor: 'pointer',

    // inner img positionning
    position: 'relative',
    '& > img': {
      position: 'absolute',
      margin: 'auto',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    }
  },
  deleteButton: {
    marginTop: theme.spacing(4)
  }
}));

const useConnect = () => {
  const dispatch = useDispatch();
  return useMemo(() => ({
    updatePerson: (person, values) => dispatch(updatePerson(person, values)),
    deletePerson: (id) => dispatch(deletePerson(id)),
  }), [dispatch]);
};

const ListItem = ({ person, ...props }) => {
  const classes = useStyles();
  const { updatePerson, deletePerson } = useConnect();
  const onUpdate = (prop, value) => updatePerson(person, { [prop]: value });
  const onDelete = () => deletePerson(person._id);

  const onChangeThumbnail = async () => {
    const { result, thumbnail } = await thumbnailSelectorDialog(person);
    if(result !== 'ok') {
      return;
    }

    updatePerson(person, { thumbnails: [thumbnail] });
  };

  return (
    <mui.ListItem {...props}>
      <mui.Paper variant='outlined' className={classes.container}>
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
          <mui.Grid item xs={12} container>
            <DeleteButton
              className={classes.deleteButton}
              tooltip={'Supprimer la personne'}
              icon
              text='Supprimer'
              confirmText={`Etes-vous sûr de vouloir supprimer la personne '${services.renderObject(person)}' ?`}
              onConfirmed={onDelete}
            />
          </mui.Grid>
        </mui.Grid>

        <ThumbnailPerson person={person} className={classes.thumbnail} onClick={onChangeThumbnail} />
      </mui.Paper>
    </mui.ListItem>
  );
};

ListItem.propTypes = {
  person: PropTypes.object.isRequired
};

export default ListItem;

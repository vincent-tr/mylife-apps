'use strict';

import { React, PropTypes, useMemo, mui, useDispatch, dialogs } from 'mylife-tools-ui';
import { useAlbumView } from '../../../common/album-view';
import { renderObject } from '../../../common/metadata-utils';
import { addDocumentToAlbum, removeDocumentFromAlbum, createAlbumWithDocument } from '../../actions';

const useConnect = () => {
  const dispatch = useDispatch();
  return useMemo(() => ({
    createAlbum: (document, title) => dispatch(createAlbumWithDocument(document, title)),
    addAlbum : (document, album) => dispatch(addDocumentToAlbum(document, album)),
    removeAlbum : (document, album) => dispatch(removeDocumentFromAlbum(document, album)),
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

const AddButton = ({ albums, addAlbum, createAlbum, ...props }) => {
  const classes = useAddButtonStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const onOpen = event => setAnchorEl(event.currentTarget);
  const onClose = () => setAnchorEl(null);

  const onAdd = (album) => {
    onClose();
    addAlbum(album);
  };

  const onNew = async () => {
    onClose();

    const { result, text: title } = await dialogs.input({ title: 'Titre du nouvel album', label: 'Titre' });
    if(result !== 'ok') {
      return;
    }

    createAlbum(title);
  };

  return (
    <>
    <mui.Tooltip title='Ajouter le document à un album'>
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
        Nouvel album ...
      </mui.MenuItem>
      {albums.map(album => (
        <mui.MenuItem key={album._id} onClick={() => onAdd(album)}>{renderObject(album)}</mui.MenuItem>
      ))}
    </mui.Menu>
    </>
  );
};

AddButton.propTypes = {
  albums: PropTypes.array.isRequired,
  addAlbum: PropTypes.func.isRequired,
  createAlbum: PropTypes.func.isRequired
};

const DetailAlbums = ({ documentWithInfo }) => {
  const classes = useStyles();
  const { albums, albumView } = useAlbumView();
  const { addAlbum, removeAlbum, createAlbum } = useConnect();

  const { document, info } = documentWithInfo;
  const albumIds = info.albums.map(item => item.id);

  const addableAlbums = useMemo(() => {
    // the same document cannot be added twice in an album
    const idSet = new Set(albumIds);
    return albums.filter(album => !idSet.has(album._id));
  }, [albumIds, albums]);

  return (
    <mui.ListItem>
      <mui.ListItemText
        disableTypography
        primary={
          <mui.Typography>
            {'Albums'}
            <AddButton
              albums={addableAlbums}
              addAlbum={album => addAlbum(document, album)}
              createAlbum={title => createAlbum(document, title)}
              className={classes.addButton}
            />
          </mui.Typography>
        }
        secondary={
          <mui.List className={classes.list} dense>
            {albumIds.map(id => {
              const album = albumView.get(id);
              if(!album) { // albumView not ready
                return null;
              }

              return (
                <mui.ListItem key={id}>
                  <mui.Typography>
                    {album.title}
                  </mui.Typography>
                  <mui.Tooltip title={'Enlever le document de l\'album'}>
                    <mui.IconButton className={classes.deleteButton} onClick={() => removeAlbum(document, album)}>
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

DetailAlbums.propTypes = {
  documentWithInfo: PropTypes.object.isRequired
};

export default DetailAlbums;

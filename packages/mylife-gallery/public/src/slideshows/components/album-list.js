'use strict';

import { React, PropTypes, mui, useDispatch, useMemo } from 'mylife-tools-ui';
import icons from '../../common/icons';
import { useAlbumView } from '../../common/album-view';
import { renderObject } from '../../common/metadata-utils';
import { addAlbumToSlideshow, removeAlbumFromSlideshow, moveAlbumInSlideshow } from '../actions';

const useConnect = () => {
  const dispatch = useDispatch();
  return useMemo(() => ({
    addAlbumToSlideshow: (slideshow, album) => dispatch(addAlbumToSlideshow(slideshow, album)),
    removeAlbumFromSlideshow: (slideshow, album) => dispatch(removeAlbumFromSlideshow(slideshow, album)),
    moveAlbumInSlideshow: (slideshow, oldIndex, newIndex) => dispatch(moveAlbumInSlideshow(slideshow, oldIndex, newIndex))
  }), [dispatch]);
};

const useStyles = mui.makeStyles(theme => ({
  addButton: {
    marginLeft: theme.spacing(1),
    color: theme.palette.success.main
  },
  deleteButton: {
    marginLeft: theme.spacing(1),
    color: theme.palette.error.main
  }
}));

const AddButton = ({ albums, addAlbum, ...props }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const onOpen = event => setAnchorEl(event.currentTarget);
  const onClose = () => setAnchorEl(null);

  const onAdd = (album) => {
    onClose();
    addAlbum(album);
  };

  return (
    <>
    <mui.Tooltip title='Ajouter un album au diaporama'>
      <mui.IconButton {...props} onClick={onOpen}>
        <mui.icons.AddCircle />
      </mui.IconButton>
    </mui.Tooltip>
    <mui.Menu
      anchorEl={anchorEl}
      open={!!anchorEl}
      onClose={onClose}
    >
      {albums.map(album => (
        <mui.MenuItem key={album._id} onClick={() => onAdd(album)}>{renderObject(album)}</mui.MenuItem>
      ))}
    </mui.Menu>
    </>
  );
};

AddButton.propTypes = {
  albums: PropTypes.array.isRequired,
  addAlbum: PropTypes.func.isRequired
};

const AlbumList = ({ slideshow, ...props }) => {
  const classes = useStyles();
  const { albums, albumView } = useAlbumView();
  const { addAlbumToSlideshow, removeAlbumFromSlideshow, moveAlbumInSlideshow } = useConnect();

  const albumIds = slideshow.albums;
  const addableAlbums = useMemo(() => {
    // the same album cannot be added twice in an slideshow
    const idSet = new Set(albumIds);
    return albums.filter(album => !idSet.has(album._id));
  }, [albumIds, albums]);

  return (
    <mui.List {...props}>
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
            <mui.Tooltip title={'Enlever l\'album du diaporama'}>
              <mui.IconButton className={classes.deleteButton} onClick={() => removeAlbumFromSlideshow(slideshow, album)}>
                <mui.icons.Delete />
              </mui.IconButton>
            </mui.Tooltip>
            {/* TODO: move */}
          </mui.ListItem>
        );
      })}

      <mui.ListItem>
        <AddButton
          albums={addableAlbums}
          addAlbum={album => addAlbumToSlideshow(slideshow, album)}
          className={classes.addButton}
        />
      </mui.ListItem>

    </mui.List>
  );
};

AlbumList.propTypes = {
  slideshow: PropTypes.object.isRequired
};

export default AlbumList;

'use strict';

import { React, PropTypes, mui, useMemo, useDispatch, clsx } from 'mylife-tools-ui';
import icons from '../../common/icons';
import { useAlbumView } from '../../common/album-view';
import { renderObject } from '../../common/metadata-utils';
import { addAlbumToSlideshow } from '../actions';

const useConnect = () => {
  const dispatch = useDispatch();
  return useMemo(() => ({
    addAlbumToSlideshow: (slideshow, album) => dispatch(addAlbumToSlideshow(slideshow, album))
  }), [dispatch]);
};

const useStyles = mui.makeStyles(theme => ({
  button: {
    color: theme.palette.getContrastText(theme.palette.success.dark),
    backgroundColor: theme.palette.success.main,
    '&:hover': {
      backgroundColor: theme.palette.success.dark,
    }
  }
}));

const AlbumAddButton = ({ slideshow, className, ...props }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const { albums } = useAlbumView();
  const { addAlbumToSlideshow } = useConnect();

  const albumIds = slideshow.albums;
  const addableAlbums = useMemo(() => {
    // the same album cannot be added twice in an slideshow
    const idSet = new Set(albumIds);
    return albums.filter(album => !idSet.has(album._id));
  }, [albumIds, albums]);

  const onOpen = event => setAnchorEl(event.currentTarget);
  const onClose = () => setAnchorEl(null);

  const onAdd = (album) => {
    onClose();
    addAlbumToSlideshow(slideshow, album);
  };

  return (
    <>
      <mui.Button
        variant='contained'
        className={clsx(classes.button, className)}
        onClick={onOpen}
        startIcon={<icons.actions.Add />}
        {...props}
      >
        {'Ajouter'}
      </mui.Button>

      <mui.Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={onClose}
      >
        {addableAlbums.map(album => (
          <mui.MenuItem key={album._id} onClick={() => onAdd(album)}>{renderObject(album)}</mui.MenuItem>
        ))}
      </mui.Menu>
    </>
  );
};

AlbumAddButton.propTypes = {
  slideshow: PropTypes.object.isRequired,
  className: PropTypes.string,
  addAlbum: PropTypes.func.isRequired
};

export default AlbumAddButton;

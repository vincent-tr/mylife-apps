import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { React, PropTypes, mui, useDispatch, useMemo, services } from 'mylife-tools-ui';
import { useAlbumView } from '../../common/shared-views';
import { removeAlbumFromSlideshow, moveAlbumInSlideshow } from '../actions';

type FIXME_any = any;

const useConnect = () => {
  const dispatch = useDispatch<FIXME_any>();
  return useMemo(() => ({
    removeAlbumFromSlideshow: (slideshow, album) => dispatch(removeAlbumFromSlideshow(slideshow, album)),
    moveAlbumInSlideshow: (slideshow, oldIndex, newIndex) => dispatch(moveAlbumInSlideshow(slideshow, oldIndex, newIndex))
  }), [dispatch]);
};

const useStyles = mui.makeStyles(theme => ({
  itemDragHandle: {
    cursor: 'grab'
  },
  deleteButton: {
    marginLeft: theme.spacing(1),
    color: theme.palette.error.main
  }
}));

const ItemDragHandle = () => {
  const classes = useStyles();
  return (
    <mui.ListItemIcon className={classes.itemDragHandle}>
      <mui.Tooltip title={'Changer l\'ordere de l\'album dans le diaporama'}>
        <mui.IconButton>
          <mui.icons.ImportExport />
        </mui.IconButton>
      </mui.Tooltip>
    </mui.ListItemIcon>
  );
};

const ItemSortableHandle = SortableHandle(ItemDragHandle);

const Item = ({ album, onDelete }) => {
  const classes = useStyles();
  return (
    <mui.ListItem>
      <ItemSortableHandle />
      <mui.ListItemText primary={services.renderObject(album)} />
      <mui.ListItemSecondaryAction>
        <mui.Tooltip title={'Enlever l\'album du diaporama'}>
          <mui.IconButton className={classes.deleteButton} onClick={() => onDelete(album)}>
            <mui.icons.Delete />
          </mui.IconButton>
        </mui.Tooltip>
      </mui.ListItemSecondaryAction>
    </mui.ListItem>
  );
};

Item.propTypes = {
  album: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired
};

const SortableItem = SortableElement(Item);

const List = ({ albums, onDelete, ...props }) => (
  <mui.List {...props}>
    {albums.map((album, index) => (
      <SortableItem key={album._id} index={index} album={album} onDelete={onDelete} />
    ))}
  </mui.List>
);

List.propTypes = {
  albums: PropTypes.array.isRequired,
  onDelete: PropTypes.func.isRequired
};

const SortableList = SortableContainer(List);

const AlbumList = ({ slideshow, ...props }) => {
  const { view } = useAlbumView();
  const { removeAlbumFromSlideshow, moveAlbumInSlideshow } = useConnect();
  const albumIds = slideshow.albums;
  const albums = albumIds.map(id => view.get(id)).filter(album => album);

  return (
    <SortableList
      dense
      useDragHandle
      albums={albums}
      onDelete={album => removeAlbumFromSlideshow(slideshow, album)}
      onSortEnd={({ oldIndex, newIndex }) => moveAlbumInSlideshow(slideshow, oldIndex, newIndex)}
      {...props}
    />
  );
};

AlbumList.propTypes = {
  slideshow: PropTypes.object.isRequired
};

export default AlbumList;

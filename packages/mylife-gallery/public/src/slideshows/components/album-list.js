'use strict';

import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { React, PropTypes, mui, useDispatch, useMemo } from 'mylife-tools-ui';
import { useAlbumView } from '../../common/album-view';
import { renderObject } from '../../common/metadata-utils';
import { removeAlbumFromSlideshow, moveAlbumInSlideshow } from '../actions';

const useConnect = () => {
  const dispatch = useDispatch();
  return useMemo(() => ({
    removeAlbumFromSlideshow: (slideshow, album) => dispatch(removeAlbumFromSlideshow(slideshow, album)),
    moveAlbumInSlideshow: (slideshow, oldIndex, newIndex) => dispatch(moveAlbumInSlideshow(slideshow, oldIndex, newIndex))
  }), [dispatch]);
};

const useStyles = mui.makeStyles(theme => ({
  listItem: {
    cursor: 'grab'
  },
  deleteButton: {
    marginLeft: theme.spacing(1),
    color: theme.palette.error.main
  }
}));

const Item = ({ album, onDelete }) => {
  const classes = useStyles();
  return (
    <mui.ListItem className={classes.listItem}>
      <mui.ListItemText primary={renderObject(album)} />
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
  const { albumView } = useAlbumView();
  const { removeAlbumFromSlideshow, moveAlbumInSlideshow } = useConnect();
  const albumIds = slideshow.albums;
  const albums = albumIds.map(id => albumView.get(id)).filter(album => album);

  return (
    <SortableList
      dense
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

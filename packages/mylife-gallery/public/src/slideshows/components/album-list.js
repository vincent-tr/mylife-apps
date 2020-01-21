'use strict';

import { React, PropTypes, mui, useDispatch, useMemo } from 'mylife-tools-ui';
import { useAlbumView } from '../../common/album-view';
import { renderObject } from '../../common/metadata-utils';
import { addAlbumToSlideshow, removeAlbumFromSlideshow, moveAlbumInSlideshow } from '../actions';

const useConnect = () => {
  const dispatch = useDispatch();
  return useMemo(() => ({
    removeAlbumFromSlideshow: (slideshow, album) => dispatch(removeAlbumFromSlideshow(slideshow, album)),
    moveAlbumInSlideshow: (slideshow, oldIndex, newIndex) => dispatch(moveAlbumInSlideshow(slideshow, oldIndex, newIndex))
  }), [dispatch]);
};

const useStyles = mui.makeStyles(theme => ({
  deleteButton: {
    marginLeft: theme.spacing(1),
    color: theme.palette.error.main
  }
}));

const AlbumList = ({ slideshow, ...props }) => {
  const classes = useStyles();
  const { albumView } = useAlbumView();
  const { removeAlbumFromSlideshow, moveAlbumInSlideshow } = useConnect();
  const albumIds = slideshow.albums;

  return (
    <mui.List dense {...props}>
      {albumIds.map(id => {
        const album = albumView.get(id);
        if(!album) { // albumView not ready
          return null;
        }

        return (
          <mui.ListItem key={id}>
            <mui.ListItemText primary={renderObject(album)} />
            <mui.ListItemSecondaryAction>
              <mui.Tooltip title={'Enlever l\'album du diaporama'}>
                <mui.IconButton className={classes.deleteButton} onClick={() => removeAlbumFromSlideshow(slideshow, album)}>
                  <mui.icons.Delete />
                </mui.IconButton>
              </mui.Tooltip>
              {/* TODO: move */}
            </mui.ListItemSecondaryAction>
          </mui.ListItem>
        );
      })}
    </mui.List>
  );
};

AlbumList.propTypes = {
  slideshow: PropTypes.object.isRequired
};

export default AlbumList;

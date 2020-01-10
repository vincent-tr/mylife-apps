'use strict';

import { React, PropTypes, useMemo, mui, useDispatch } from 'mylife-tools-ui';
import { useAlbumView } from '../../../common/album-view';

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

const DetailAlbums = ({ documentWithInfo }) => {
  const classes = useStyles();
  const { albumView } = useAlbumView();
  const albumIds = documentWithInfo.info.albums.map(item => item.id);

  return (
    <mui.ListItem>
      <mui.ListItemText
        disableTypography
        primary={
          <mui.Typography>
            {'Albums'}
            <mui.Tooltip title='Ajouter le document à un album'>
              <mui.IconButton className={classes.addButton}>
                <mui.icons.AddCircle />
              </mui.IconButton>
            </mui.Tooltip>
          </mui.Typography>
        }
        secondary={
          <mui.List className={classes.list} dense>
            {albumIds.map(id => {
              const album = albumView.get(id);
              return (
                <mui.ListItem key={id}>
                  <mui.Typography>
                    {album.title}
                  </mui.Typography>
                  <mui.Tooltip title={'Enlever le document de l\'album'}>
                    <mui.IconButton className={classes.deleteButton}>
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

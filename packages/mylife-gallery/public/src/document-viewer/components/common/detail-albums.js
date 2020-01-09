'use strict';

import { React, PropTypes, useMemo, mui, useDispatch } from 'mylife-tools-ui';

const albums = ['album 1', 'album 2', 'album 3', 'album 4', 'album 5', 'album 1', 'album 2', 'album 3', 'album 4', 'album 5'];

const useStyles = mui.makeStyles({
  list: {
    width: 300,
    height: 180,
    overflow: 'auto'
  }
});

const DetailAlbums = ({ document }) => {
  const classes = useStyles();

  return (
    <mui.ListItem>
      <mui.ListItemText
        disableTypography
        primary={
          <mui.Typography>{'Albums'}</mui.Typography>
        }
        secondary={
          <mui.List className={classes.list} dense>
            {albums.map((album, index) => (
              <mui.ListItem key={index}>
                <mui.Typography>
                  {album}
                </mui.Typography>
                <mui.IconButton>
                  <mui.icons.Delete />
                </mui.IconButton>
              </mui.ListItem>
            ))}
          </mui.List>
        } />
    </mui.ListItem>
  );
};

DetailAlbums.propTypes = {
  document: PropTypes.object.isRequired
};

export default DetailAlbums;

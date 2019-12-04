'use strict';

import { React, PropTypes, mui } from 'mylife-tools-ui';
import icons from '../../common/icons';

const useStyles = mui.makeStyles({
  tile: {
    height: 200,
    width: 200
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
});

const MAX_SIZE = 100;

const List = ({ data }) => {

  const classes = useStyles();

  return (
    <mui.GridList cols={0}>
      {data.slice(0, MAX_SIZE).map(document => (
        <mui.GridListTile key={document._id} classes={{root: classes.tile}}>
          <img src={thumbnailUrl(document)} />
          <mui.GridListTileBar
            title={document.caption}
            subtitle={document.keywords.join(' ')}
            actionIcon={
              <mui.IconButton className={classes.icon}>
                <icons.actions.Fullscreen />
              </mui.IconButton>
            }
          />
        </mui.GridListTile>
      ))}
    </mui.GridList>
  );
};

List.propTypes = {
  data: PropTypes.array.isRequired
};

export default List;

function thumbnailUrl(document) {
  switch(document._entity) {
    case 'image':
      return `/content/thumbnail/${document.thumbnail}`;
    case 'video':
      return `/content/thumbnail/${document.thumbnails[0]}`;
    default:
      return null;
  }
}

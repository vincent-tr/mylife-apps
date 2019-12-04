'use strict';

import { React, PropTypes, mui } from 'mylife-tools-ui';
import icons from '../../common/icons';

const useStyles = mui.makeStyles({
  gridList: {
    display: 'flex'
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.54)',
  },
});

const MAX_SIZE = 100;

const List = ({ data }) => {

  console.log(data)

  const classes = useStyles();

  return (
    <div className={classes.gridList}>
      {data.slice(0, MAX_SIZE).map(document => (
        <mui.GridListTile key={document._id}>
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
    </div>
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

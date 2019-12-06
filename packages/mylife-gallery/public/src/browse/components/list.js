'use strict';

import { React, PropTypes, mui } from 'mylife-tools-ui';
import * as documentViewer from '../../common/document-viewer';

const THUMBNAIL_SIZE = 200;

const useStyles = mui.makeStyles(theme => ({
  tile: {
    // size + image position
    height: THUMBNAIL_SIZE,
    width: THUMBNAIL_SIZE,
    textAlign:'center',

    // spacing
    margin: theme.spacing(1),

    // border
    borderWidth: 1,
    borderColor: mui.colors.grey[300],
    borderStyle: 'solid',

    // cursor
    cursor: 'pointer',
  },
  image: {
    // reset base style
    top: 'unset',
    left: 'unset',
    height: 'unset',
    width: 'unset',
    transform: 'unset',
    position: 'relative',
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
}));

const Tile = ({ document }) => {
  const classes = useStyles();
  const tileClasses = { tile: classes.tile, imgFullHeight: classes.image, imgFullWidth: classes.image };
  const thumbnailUrl = getThumbnailUrl(document);
  const title = getTitle(document);
  const subtitle = getSubtitle(document);

  return (
    <mui.GridListTile classes={tileClasses} onClick={() => documentViewer.showDialog(document)}>
      <img src={thumbnailUrl} />
      <mui.GridListTileBar title={title} subtitle={subtitle} />
    </mui.GridListTile>
  );
};

Tile.propTypes = {
  document: PropTypes.object.isRequired
};

const List = ({ data }) => {
  return (
    <mui.GridList cols={0} cellHeight={THUMBNAIL_SIZE}>
      {data.map(document => (<Tile key={document._id} document={document}/>))}
    </mui.GridList>
  );
};

List.propTypes = {
  data: PropTypes.array.isRequired
};

export default List;

function getThumbnailUrl(document) {
  switch(document._entity) {
    case 'image':
      return `/content/thumbnail/${document.thumbnail}`;
    case 'video':
      return `/content/thumbnail/${document.thumbnails[0]}`;
    default:
      return null;
  }
}

function getTitle(document) {
  if(document.caption) {
    return document.caption;
  }
  const path = document.paths[0].path;
  const fileName = path.replace(/^.*[\\/]/, '');
  return fileName;
}

function getSubtitle(document) {
  if(document.keywords.length) {
    return document.keywords.join(' ');
  }

  return document.paths[0].path;
}

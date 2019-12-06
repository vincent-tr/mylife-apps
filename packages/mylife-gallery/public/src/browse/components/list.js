'use strict';

import { React, PropTypes, mui } from 'mylife-tools-ui';
import icons from '../../common/icons';
import * as documentViewer from '../../common/document-viewer';

const THUMBNAIL_SIZE = 200;

const useStyles = mui.makeStyles({
  tile: {
    height: THUMBNAIL_SIZE,
    width: THUMBNAIL_SIZE,
    textAlign:'center'
  },
  image: {
    // reset base style
    top: 'unset',
    left: 'unset',
    height: 'unset',
    width: 'unset',
    transform: 'unset',
    position: 'relative'
  },
  icon: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
});

const List = ({ data }) => {

  const classes = useStyles();
  const tileClasses = { tile: classes.tile, imgFullHeight: classes.image, imgFullWidth: classes.image };

  return (
    <mui.GridList cols={0} cellHeight={THUMBNAIL_SIZE}>
      {data.map(document => {
        const { thumbnailUrl, title, subtitle } = getDocumentInfo(document);
        return (
          <mui.GridListTile key={document._id} classes={tileClasses}>
            <img src={thumbnailUrl} />
            <mui.GridListTileBar
              title={title}
              subtitle={subtitle}
              actionIcon={
                <mui.IconButton className={classes.icon} onClick={() => documentViewer.showDialog(document)}>
                  <icons.actions.Fullscreen/>
                </mui.IconButton>
              }
            />
          </mui.GridListTile>
        );
      })}
    </mui.GridList>
  );
};

List.propTypes = {
  data: PropTypes.array.isRequired
};

export default List;

function getDocumentInfo(document) {
  return {
    thumbnailUrl: getThumbnailUrl(document),
    title: getTitle(document),
    subtitle: getSubtitle(document),
  };
}

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

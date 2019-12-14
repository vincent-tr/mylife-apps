'use strict';

import { React, PropTypes, mui } from 'mylife-tools-ui';
import * as documentUtils from '../../common/document-utils';
import * as documentViewer from '../../common/document-viewer';
import Thumbnail from '../../common/thumbnail';

const useStyles = mui.makeStyles(theme => ({
  tile: {
    // size + image position
    height: Thumbnail.SIZE,
    width: Thumbnail.SIZE,
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
  const { title, subtitle } = documentUtils.getInfo(document);

  return (
    <mui.GridListTile classes={tileClasses} onClick={() => documentViewer.showDialog(document)}>
      <Thumbnail document={document} />
      <mui.GridListTileBar title={title} subtitle={subtitle} />
    </mui.GridListTile>
  );
};

Tile.propTypes = {
  document: PropTypes.object.isRequired
};

const List = ({ data }) => {
  return (
    <mui.GridList cols={0} cellHeight={Thumbnail.SIZE}>
      {data.map(document => (<Tile key={document._id} document={document}/>))}
    </mui.GridList>
  );
};

List.propTypes = {
  data: PropTypes.array.isRequired
};

export default List;

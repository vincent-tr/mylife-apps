'use strict';

import { React, PropTypes, mui, VirtuosoGrid, AutoSizer, clsx } from 'mylife-tools-ui';
import * as documentUtils from '../../common/document-utils';
import * as documentViewer from '../../document-viewer';
import Thumbnail from '../../common/thumbnail';

const useStyles = mui.makeStyles(theme => ({
  list: {
    overflowY: 'visible'
  },
  tileContainer: {
    height: Thumbnail.SIZE,
    width: Thumbnail.SIZE,
  },
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
  empty: {
  }
}));

const PADDING = 2*8;

const Tile = ({ viewId, document }) => {
  const classes = useStyles();
  const tileClasses = { tile: classes.tile, imgFullHeight: classes.image, imgFullWidth: classes.image };
  const { title, subtitle } = documentUtils.getInfo(document);

  return (
    <mui.GridListTile classes={tileClasses} onClick={() => documentViewer.showDialog(document._entity, document._id)}>
      <Thumbnail document={document} />
      <mui.GridListTileBar title={title} subtitle={subtitle} />
    </mui.GridListTile>
  );
};

Tile.propTypes = {
  viewId: PropTypes.number.isRequired,
  document: PropTypes.object.isRequired
};

const TileContainer = ({ className, ...props }) => {
  const classes = useStyles();
  return (
    <div className={clsx(classes.tileContainer, className)} {...props} />
  );
};

TileContainer.propTypes = {
  className: PropTypes.string
};

const GridList = ({ listRef, className, ...props }) => {
  const classes = useStyles();
  return (
    <mui.GridList ref={listRef} cols={0} cellHeight={Thumbnail.SIZE + PADDING} className={clsx(classes.list, className)} {...props}/>
  );
};

GridList.propTypes = {
  // https://stackoverflow.com/questions/48007326/what-is-the-correct-proptype-for-a-ref-in-react
  listRef: PropTypes.oneOfType([ PropTypes.func, PropTypes.shape({ current: PropTypes.any })]),
  className: PropTypes.string
};

const List = ({ className, viewId, data }) => {
  const classes = useStyles();

  if(!data.length) {
    return (
      <GridList className={className}>
        {[]}
      </GridList>
    );
  }

  return (
    <div className={className}>
      <AutoSizer>
        {({ height, width }) => (
          <VirtuosoGrid
            totalCount={data.length}
            overscan={200}
            ListContainer={GridList}
            ItemContainer={TileContainer}
            item={index => (<Tile viewId={viewId} document={data[index]} />)}
            listClassName={classes.empty}
            itemClassName={classes.empty}
            style={{ height, width, overflowX: 'hidden' }} />
        )}
      </AutoSizer>
    </div>
  );
};

List.propTypes = {
  className: PropTypes.string,
  viewId: PropTypes.number,
  data: PropTypes.array.isRequired
};

export default List;

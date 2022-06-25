'use strict';

import { React, PropTypes, mui, VirtuosoGrid, AutoSizer, clsx } from 'mylife-tools-ui';
import { THUMBNAIL_SIZE } from './thumbnail';

const useStyles = mui.makeStyles(theme => ({
  list: {
    overflowY: 'visible'
  },
  tileContainer: {
    height: THUMBNAIL_SIZE,
    width: THUMBNAIL_SIZE,
  },
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

    // children
    position: 'relative',

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
  checkbox: {
    position: 'absolute',
    top: 0,
    right: 0,

    // keep it on hover, checked hover, etc
    backgroundColor: 'rgba(200, 200, 200, 0.5) !important',
  },
  empty: {
  }
}));

const PADDING = 2*8;

const TextWithTooltipIfOveryflow = ({ text }) => {
  if(!text) {
    return null;
  }

  return (
    <mui.Tooltip title={text}>
      <span>
        {text}
      </span>
    </mui.Tooltip>
  );
};

TextWithTooltipIfOveryflow.propTypes = {
  text: PropTypes.string,
};


const Tile = ({ data, index, showTileBar, selectable, getTileInfo }) => {
  const classes = useStyles();
  const tileClasses = { item: classes.tile, imgFullHeight: classes.image, imgFullWidth: classes.image };
  const { title, subtitle, thumbnail, onClick, selected, onSelect } = getTileInfo(data, index);

  return (
    <mui.ImageListItem classes={tileClasses} onClick={onClick}>
      {thumbnail}
      {showTileBar && (
        <mui.ImageListItemBar
          title={<TextWithTooltipIfOveryflow text={title} />}
          subtitle={<TextWithTooltipIfOveryflow text={subtitle} />}
        />
      )}
      {selectable && (
        <mui.Checkbox
          checked={selected}
          onChange={e => onSelect(e.target.checked)}
          onClick={e => e.stopPropagation()}
          size='small'
          color='primary'
          className={classes.checkbox}
        />
      )}
    </mui.ImageListItem>
  );
};

Tile.propTypes = {
  data: PropTypes.array.isRequired,
  index: PropTypes.number.isRequired,
  showTileBar: PropTypes.bool.isRequired,
  selectable: PropTypes.bool.isRequired,
  getTileInfo: PropTypes.func.isRequired
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

const ImageList = React.forwardRef(({ className, ...props }, ref) => {
  const classes = useStyles();
  return (
    <mui.ImageList ref={ref} cols={0} rowHeight={THUMBNAIL_SIZE + PADDING} className={clsx(classes.list, className)} {...props}/>
  );
});

ImageList.propTypes = {
  className: PropTypes.string
};

const ThumbnailList = ({ className, data, showTileBar = false, selectable = false, getTileInfo }) => {
  const classes = useStyles();

  if(!data.length) {
    return (
      <ImageList className={className}>
        {[]}
      </ImageList>
    );
  }

  return (
    <div className={className}>
      <AutoSizer>
        {({ height, width }) => (
          <VirtuosoGrid
            totalCount={data.length}
            overscan={200}
            components={{ List: ImageList, Item: TileContainer }}
            itemContent={index => (<Tile data={data} index={index} showTileBar={showTileBar} selectable={selectable} getTileInfo={getTileInfo} />)}
            listClassName={classes.empty}
            itemClassName={classes.empty}
            style={{ height, width, overflowX: 'hidden' }} />
        )}
      </AutoSizer>
    </div>
  );
};

ThumbnailList.propTypes = {
  className: PropTypes.string,
  data: PropTypes.array.isRequired,
  showTileBar: PropTypes.bool,
  selectable: PropTypes.bool,
  getTileInfo: PropTypes.func.isRequired
};

export default ThumbnailList;

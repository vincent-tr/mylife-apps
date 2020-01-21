'use strict';

import { React, PropTypes, mui, useState, useSelector, clsx } from 'mylife-tools-ui';
import { THUMBNAIL_SIZE } from '../../common/thumbnail';
import { useCommonStyles } from '../../common/thumbnail/utils';
import BaseNone from '../../common/thumbnail/base-none';
import { useSlideshowImageView } from '../../common/slideshow-image-view';

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
  },
  image: {
    // reset base style
    top: 'unset',
    left: 'unset',
    height: 'unset',
    width: 'unset',
    transform: 'unset',
    position: 'relative',
  }
}));

const ThumbnailOrLoading = ({ imageUrl }) => {
  const classes = useCommonStyles();
  const loading = !imageUrl;

  if(loading) {
    return (
      <mui.CircularProgress className={classes.loading} />
    );
  }

  return (
    <img src={imageUrl} />
  );
};

ThumbnailOrLoading.propTypes = {
  imageUrl: PropTypes.string
};

const NotEmpty = ({ slideshow }) => {
  // const { selectedId,  } = useConnect();
  const [imageUrl, setImageUrl] = useState(null);
  return (
    <ThumbnailOrLoading imageUrl={imageUrl} />
  );
};

const Preview = ({ slideshow, className, ...props }) => {
  const classes = { ...useCommonStyles(), ...useStyles() };
  const tileClasses = { tile: classes.tile, imgFullHeight: classes.image, imgFullWidth: classes.image };
  const empty = !slideshow.albums.length;
  const { slideshowImages } = useSlideshowImageView(slideshow._id);

  console.log(slideshowImages);

  return (
    <mui.GridListTile component='div' classes={tileClasses}>
      <div className={clsx(classes.container, className)} {...props}>
        {empty ? (
          <BaseNone />
        ) : (
          <NotEmpty slideshow={slideshow} />
        )}
      </div>
      <mui.GridListTileBar title={`${slideshow.albums.length} album(s)`} />
    </mui.GridListTile>
  );
};

Preview.propTypes = {
  slideshow: PropTypes.object.isRequired,
  className: PropTypes.string
};

export default Preview;

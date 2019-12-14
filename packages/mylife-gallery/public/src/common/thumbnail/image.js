'use strict';

import { React, PropTypes, mui, clsx, useState } from 'mylife-tools-ui';
import { getThumbnailUrl } from './utils';
import icons from '../icons';

const useStyles = mui.makeStyles({
  container: {
    height: 200,
    width: 200
  },
  imageLoading: {
    display: 'none'
  },
  imageFallback: {
    height: '100%',
    width: '100%'
  }
});

const ThumbnailImage = ({ document, className, ...props }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);

  let content;

  if(document.thumbnail) {
    const thumbnailUrl = getThumbnailUrl(document.thumbnail);
    content = (
      <React.Fragment>
        <img
          className={clsx({ [classes.imageLoading]: loading })}
          src={thumbnailUrl}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)} />
        {loading && (
          <icons.documents.Unknow className={classes.imageFallback}n />
        )}
      </React.Fragment>
    );
  } else {
    content = (
      <icons.documents.None className={classes.imageFallback} />
    );
  }

  return (
    <div className={clsx(classes.container, className)} {...props}>
      {content}
    </div>
  );
};

ThumbnailImage.propTypes = {
  document: PropTypes.object.isRequired,
  className: PropTypes.string
};

export default ThumbnailImage;

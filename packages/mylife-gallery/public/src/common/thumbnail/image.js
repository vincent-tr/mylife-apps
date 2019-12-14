'use strict';

import { React, PropTypes, clsx, useState } from 'mylife-tools-ui';
import { getThumbnailUrl, useCommonStyles } from './utils';
import icons from '../icons';

const ThumbnailImage = ({ document, className, ...props }) => {
  const classes = useCommonStyles();
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

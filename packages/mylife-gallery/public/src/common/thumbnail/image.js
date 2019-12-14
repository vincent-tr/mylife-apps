'use strict';

import { React, PropTypes, clsx, useState, useEffect } from 'mylife-tools-ui';
import { getThumbnailUrl, useCommonStyles } from './utils';
import icons from '../icons';

const ThumbnailImage = ({ document, className, ...props }) => {
  const classes = useCommonStyles();
  const [loading, setLoading] = useState(false);

  // onLoadStart not fired on chrome
  useEffect(() => setLoading(true), [document.thumbnail]);

  let content;

  if(document.thumbnail) {
    const thumbnailUrl = getThumbnailUrl(document.thumbnail);
    content = (
      <React.Fragment>
        <img
          className={clsx({ [classes.imageLoading]: loading })}
          src={thumbnailUrl}
          onLoad={() => setLoading(false)} />
        {loading && (
          <icons.documents.Unknown className={classes.imageFallback} />
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

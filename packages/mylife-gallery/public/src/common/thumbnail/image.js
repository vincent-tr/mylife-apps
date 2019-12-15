'use strict';

import { React, PropTypes, clsx, useState, useEffect } from 'mylife-tools-ui';
import { getThumbnailUrl, useCommonStyles } from './utils';
import icons from '../icons';

const NotNull = ({ thumbnail }) => {
  const classes = useCommonStyles();
  const [loading, setLoading] = useState(false);

  // onLoadStart not fired on chrome
  useEffect(() => setLoading(true), [thumbnail]);

  const thumbnailUrl = getThumbnailUrl(thumbnail);
  return (
    <React.Fragment>
      <img
        className={clsx({ [classes.imageLoading]: loading })}
        src={thumbnailUrl}
        onLoad={() => setLoading(false)} />
      {loading && (
        <icons.documents.Pending className={classes.imageFallback} />
      )}
    </React.Fragment>
  );
};

NotNull.propTypes = {
  thumbnail: PropTypes.string.isRequired
};

const ThumbnailImage = ({ document, className, ...props }) => {
  const classes = useCommonStyles();
  return (
    <div className={clsx(classes.container, className)} {...props}>
      {document.thumbnail ? (
        <NotNull thumbnail={document.thumbnail}/>
      ) : (
        <icons.documents.None className={classes.imageFallback} />
      )}
    </div>
  );
};

ThumbnailImage.propTypes = {
  document: PropTypes.object.isRequired,
  className: PropTypes.string
};

export default ThumbnailImage;

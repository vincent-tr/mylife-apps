'use strict';

import { React, PropTypes, mui, clsx, useState, useInterval } from 'mylife-tools-ui';
import { useCommonStyles, useImages } from './utils';
import icons from '../icons';

const NotNull = ({ thumbnails }) => {
  const classes = useCommonStyles();
  const imageUrl = useImageSlider(thumbnails);
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

NotNull.propTypes = {
  thumbnails: PropTypes.array.isRequired
};

const ThumbnailVideo = ({ document, className, ...props }) => {
  const classes = useCommonStyles();
  const { thumbnails } = document;

  return (
    <div className={clsx(classes.container, className)} {...props}>
      {(thumbnails && thumbnails.length) ? (
        <NotNull thumbnails={thumbnails}/>
      ) : (
        <icons.documents.None className={classes.fallback} />
      )}
    </div>
  );
};

ThumbnailVideo.propTypes = {
  document: PropTypes.object.isRequired,
  className: PropTypes.string
};

export default ThumbnailVideo;

function useImageSlider(sources) {
  const imageUrls = useImages(sources);
  const [currentIndex, setCurrentIndex] = useState(0);
  const loading = imageUrls.some(url => !url);

  useInterval(() => setCurrentIndex(index => ((index + 1) % sources.length)), 1000);

  return loading ? null : imageUrls[currentIndex];
}

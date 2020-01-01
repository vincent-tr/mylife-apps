'use strict';

import { React, PropTypes, mui, clsx, useEffect, useState, useInterval } from 'mylife-tools-ui';
import { getThumbnailUrl, useCommonStyles } from './utils';
import icons from '../icons';

export const useStyles = mui.makeStyles({
  imageHide: {
    display: 'none'
  }
});

const ThumbnailItem = ({ thumbnail, show, onLoadingChange }) => {
  const classes = useStyles();

  // onLoadStart not fired on chrome
  useEffect(() => onLoadingChange(true), [thumbnail]);

  const thumbnailUrl = getThumbnailUrl(thumbnail);
  return (
    <img
      className={clsx({ [classes.imageHide]: !show })}
      src={thumbnailUrl}
      onLoad={() => onLoadingChange(false)} />
  );
};

ThumbnailItem.propTypes = {
  thumbnail: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
  onLoadingChange: PropTypes.func.isRequired
};

const NotNull = ({ thumbnails }) => {
  const classes = useCommonStyles();
  const [loadingCount, setLoadingCount] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const onLoadingChange = value => {
    setLoadingCount(count => value ? count + 1 : count - 1);
  };

  useInterval(() => setCurrentIndex(index => ((index + 1) % thumbnails.length)), 1000);

  return (
    <React.Fragment>
      {thumbnails.map((thumbnail, index) => {
        const show = loadingCount === 0 && currentIndex === index;
        return (
          <ThumbnailItem key={thumbnail} thumbnail={thumbnail} show={show} onLoadingChange={onLoadingChange} />
        );
      })}
      {!!loadingCount && (
        <mui.CircularProgress className={classes.loading} />
      )}
    </React.Fragment>
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

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

interface BaseMultiProps {
  thumbnails?: string[];
  className?: string;
}

const BaseMulti: React.FunctionComponent<BaseMultiProps> = ({ thumbnails, className, ...props }) => {
  const classes = useCommonStyles();

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

BaseMulti.propTypes = {
  thumbnails: PropTypes.array,
  className: PropTypes.string
};

export default BaseMulti;

function useImageSlider(sources) {
  const imageUrls = useImages(sources);
  const [currentIndex, setCurrentIndex] = useState(0);
  const loading = imageUrls.some(url => !url);

  useInterval(() => setCurrentIndex(index => ((index + 1) % sources.length)), 1000);

  return loading ? null : imageUrls[currentIndex];
}

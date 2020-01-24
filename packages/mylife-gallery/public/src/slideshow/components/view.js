'use strict';

import { React, PropTypes } from 'mylife-tools-ui';
import { useSlideshowImageView } from '../../common/slideshow-image-view';
import { useSlideshowEngineMedia } from '../../common/slideshow-engine';
import Empty from './empty';
import Loading from './loading';
import Image from './image';

const ViewWithSlideshowNotEmpty = ({ slideshow, ...props }) => {
  const imageUrl = useSlideshowEngineMedia(slideshow);
  const loading = !imageUrl;
  if(loading) {
    return (
      <Loading {...props} />
    );
  }

  return (
    <Image slideshow={slideshow} url={imageUrl} {...props} />
  );
};

ViewWithSlideshowNotEmpty.propTypes = {
  slideshow: PropTypes.object.isRequired
};

const ViewWithSlideshow = ({ slideshow, ...props }) => {
  const { slideshowImages } = useSlideshowImageView(slideshow._id);
  const empty = !slideshowImages.size;
  if(empty) {
    return (
      <Empty {...props} />
    );
  }

  return (
    <ViewWithSlideshowNotEmpty slideshow={slideshow} {...props} />
  );
};

ViewWithSlideshow.propTypes = {
  slideshow: PropTypes.object.isRequired
};

const View = ({ slideshow, ...props }) => {
  if(!slideshow) {
    return (
      <Loading {...props} />
    );
  }

  return (
    <ViewWithSlideshow slideshow={slideshow} {...props} />
  );
};

View.propTypes = {
  slideshow: PropTypes.object,
  className: PropTypes.string
};

export default View;

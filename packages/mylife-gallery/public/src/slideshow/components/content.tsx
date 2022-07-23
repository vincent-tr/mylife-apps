'use strict';

import { React, PropTypes } from 'mylife-tools-ui';
import { useSlideshowImageView } from '../../common/slideshow-image-view';
import { useSlideshowEngineMedia } from '../../common/slideshow-engine';
import Empty from './empty';
import Loading from './loading';
import Image from './image';

const ContentWithSlideshowNotEmpty = ({ slideshow, ...props }) => {
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

ContentWithSlideshowNotEmpty.propTypes = {
  slideshow: PropTypes.object.isRequired
};

const ContentWithSlideshow = ({ slideshow, ...props }) => {
  const { slideshowImages } = useSlideshowImageView(slideshow._id);
  const empty = !slideshowImages.size;
  if(empty) {
    return (
      <Empty {...props} />
    );
  }

  return (
    <ContentWithSlideshowNotEmpty slideshow={slideshow} {...props} />
  );
};

ContentWithSlideshow.propTypes = {
  slideshow: PropTypes.object.isRequired
};

const Content = ({ slideshow, ...props }) => {
  if(!slideshow) {
    return (
      <Loading {...props} />
    );
  }

  return (
    <ContentWithSlideshow slideshow={slideshow} {...props} />
  );
};

Content.propTypes = {
  slideshow: PropTypes.object,
  className: PropTypes.string
};

export default Content;

'use strict';

import { React, PropTypes } from 'mylife-tools-ui';

const ThumbnailVideo = ({ document, ...props }) => {
  void document;
  return (
    <img src={'TODO'} {...props}/>
  );
};

ThumbnailVideo.propTypes = {
  document: PropTypes.object.isRequired,
};

export default ThumbnailVideo;

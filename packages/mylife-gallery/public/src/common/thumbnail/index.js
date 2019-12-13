'use strict';

import { React, PropTypes } from 'mylife-tools-ui';
import ThumbnailImage from './image';
import ThumbnailVideo from './video';
import ThumbnailOther from './other';

const Thumbnail = ({ document, ...props }) => {
  switch(document._entity) {
    case 'image':
      return (<ThumbnailImage document={document} {...props} />);
    case 'video':
      return (<ThumbnailVideo document={document} {...props} />);
    case 'other':
      return (<ThumbnailOther document={document} {...props} />);
  }
};

Thumbnail.propTypes = {
  document: PropTypes.object.isRequired,
};

export default Thumbnail;

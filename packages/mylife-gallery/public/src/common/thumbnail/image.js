'use strict';

import { React, PropTypes } from 'mylife-tools-ui';
import { getInfo } from '../document-utils';

const ThumbnailImage = ({ document, ...props }) => {
  const { thumbnailUrl } = getInfo(document);
  return (
    <img src={thumbnailUrl} {...props}/>
  );
};

ThumbnailImage.propTypes = {
  document: PropTypes.object.isRequired,
};

export default ThumbnailImage;

'use strict';

import { React, PropTypes } from 'mylife-tools-ui';
import { getInfo } from '../document-utils';

const ThumbnailImage = ({ document, ...props }) => {
  const { thumbnailUrl } = getInfo(document);
  const tmp = () => {};
  return (
    <img src={thumbnailUrl} onLoadStart={tmp} onLoadEnd={tmp} {...props}/>
  );
};

ThumbnailImage.propTypes = {
  document: PropTypes.object.isRequired,
};

export default ThumbnailImage;

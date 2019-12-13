'use strict';

import { React, PropTypes } from 'mylife-tools-ui';

const ThumbnailOther = ({ document, ...props }) => {
  void document;
  return (
    <img src={'TODO'} {...props}/>
  );
};

ThumbnailOther.propTypes = {
  document: PropTypes.object.isRequired,
};

export default ThumbnailOther;

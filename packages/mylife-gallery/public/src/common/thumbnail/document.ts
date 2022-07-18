'use strict';

import { React, PropTypes } from 'mylife-tools-ui';
import BaseMono from './base-mono';
import BaseMulti from './base-multi';
import BaseNone from './base-mono';

const ThumbnailDocument = ({ document, ...props }) => {
  switch(document._entity) {
    case 'image':
      return (<BaseMono thumbnail={document.thumbnail} {...props} />);
    case 'video':
      return (<BaseMulti thumbnails={document.thumbnails} {...props} />);
    case 'other':
      return (<BaseNone {...props} />);
  }
};

ThumbnailDocument.propTypes = {
  document: PropTypes.object.isRequired,
};

export default ThumbnailDocument;

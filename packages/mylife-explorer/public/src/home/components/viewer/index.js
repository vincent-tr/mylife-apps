'use strict';

import { React, PropTypes } from 'mylife-tools-ui';
import Default from './default';
import Directory from './directory';
import Text from './text';

const Viewer = ({ data, ...props }) => {
  const ViewerType = getViewerType(data) || Default;
  return (
    <ViewerType data={data} {...props} />
  );
};

Viewer.propTypes = {
  data: PropTypes.object.isRequired
};

export default Viewer;

function getViewerType(data) {
  switch(data.type) {
    case 'Directory':
      return Directory;

    case 'File':
      return getFileViewerType(data.mime);
  }
}

function getFileViewerType(mime) {
  const [type, subtype] = mime.split('/');
  switch(type) {
    case 'application':
      switch(subtype) {
        case 'json':
          return Text;
      }
      break;

    case 'text':
      return Text;
  }
}
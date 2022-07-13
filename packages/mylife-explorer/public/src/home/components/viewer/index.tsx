'use strict';

import { React, PropTypes } from 'mylife-tools-ui';
import { getFileTypeViewer } from '../file-types';
import Default from './default';
import Directory from './directory';

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
      return getFileTypeViewer(data);
  }
}

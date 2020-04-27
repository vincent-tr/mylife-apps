'use strict';

import { React, PropTypes } from 'mylife-tools-ui';
import Default from './default';
import Directory from './directory';

const Viewer = ({ data, ...props }) => {
  const ViewerType = getViewerType(data);
  return (
    <ViewerType data={data} {...props} />
  );
};

Viewer.propTypes = {
  path: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired
};

export default Viewer;

function getViewerType(data) {
  switch(data.type) {
    case 'Directory':
      return Directory;

    default:
      return Default;
  }
}
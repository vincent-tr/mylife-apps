'use strict';

import { React, PropTypes } from 'mylife-tools-ui';

const Viewer = ({ path, data }) => {
  if(!data) {
    return null;
  }

  return (
    <div>
      Viewer
    </div>
  );
};

Viewer.propTypes = {
  path: PropTypes.string.isRequired,
  data: PropTypes.object
};

export default Viewer;

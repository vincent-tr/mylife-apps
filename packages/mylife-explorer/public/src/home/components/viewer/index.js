'use strict';

import { React, PropTypes } from 'mylife-tools-ui';

const Viewer = ({ path, data }) => {
  return (
    <div>
      Viewer
    </div>
  );
};

Viewer.propTypes = {
  path: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired
};

export default Viewer;

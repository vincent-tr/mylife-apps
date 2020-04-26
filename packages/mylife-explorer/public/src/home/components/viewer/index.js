'use strict';

import { React, PropTypes } from 'mylife-tools-ui';

const Viewer = ({ path, data, ...props }) => {
  return (
    <div {...props}>
      Viewer
    </div>
  );
};

Viewer.propTypes = {
  path: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired
};

export default Viewer;

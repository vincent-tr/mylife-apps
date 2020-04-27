'use strict';

import { React, PropTypes } from 'mylife-tools-ui';

const Default = ({ path, data, ...props }) => {
  return (
    <div {...props}>
      Default Viewer
    </div>
  );
};

Default.propTypes = {
  path: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired
};

export default Default;

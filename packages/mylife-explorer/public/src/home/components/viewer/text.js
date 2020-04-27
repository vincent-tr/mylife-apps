'use strict';

import { React, PropTypes } from 'mylife-tools-ui';

const Text = ({ path, data, ...props }) => {
  return (
    <div {...props}>
      Text Viewer
    </div>
  );
};

Text.propTypes = {
  path: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired
};

export default Text;

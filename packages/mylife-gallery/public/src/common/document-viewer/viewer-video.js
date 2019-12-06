'use strict';

import { React, PropTypes, mui } from 'mylife-tools-ui';

const ViewerImage = ({ document }) => (
  <div>
    VIDEO {JSON.stringify(document)}
  </div>
);

ViewerImage.propTypes = {
  document: PropTypes.object.isRequired,
};

export default ViewerImage;

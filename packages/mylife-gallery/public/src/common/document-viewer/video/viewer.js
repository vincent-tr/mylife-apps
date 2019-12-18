'use strict';

import { React, PropTypes, mui } from 'mylife-tools-ui';

const OtherViewer = ({ document }) => (
  <div>
    VIDEO {JSON.stringify(document)}
  </div>
);

OtherViewer.propTypes = {
  document: PropTypes.object.isRequired,
};

export default OtherViewer;

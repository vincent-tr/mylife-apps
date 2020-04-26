'use strict';

import { React, PropTypes } from 'mylife-tools-ui';

const Detail = ({ path, data }) => {
  return (
    <div>
      Detail
    </div>
  );
};

Detail.propTypes = {
  path: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired
};

export default Detail;

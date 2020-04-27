'use strict';

import { React, PropTypes } from 'mylife-tools-ui';
import ReactPanZoom from 'react-image-pan-zoom-rotate';
import { makeUrl } from '../tools';

const Text = ({ data, ...props }) => {
  return (
    <div {...props} style={{ position: 'relative'}}>
      <ReactPanZoom image={makeUrl(data)} />
    </div>
  );
};

Text.propTypes = {
  data: PropTypes.object.isRequired
};

export default Text;

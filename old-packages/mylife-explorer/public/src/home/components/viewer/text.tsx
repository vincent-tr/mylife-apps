'use strict';

import { React, PropTypes } from 'mylife-tools-ui';
import { LazyLog } from 'react-lazylog';
import { makeUrl } from '../tools';

const Text = ({ data, ...props }) => (
  <div {...props}>
    <LazyLog url={makeUrl(data)} />
  </div>
);

Text.propTypes = {
  data: PropTypes.object.isRequired
};

export default Text;

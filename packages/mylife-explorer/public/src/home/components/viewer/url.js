'use strict';

import { React, PropTypes, clsx } from 'mylife-tools-ui';
import { makeUrl } from '../tools';

const Url = ({ data, ...props }) => (
  <div {...props}>
    {makeUrl(data)}
  </div>
);

Url.propTypes = {
  data: PropTypes.object.isRequired,
};

export default Url;

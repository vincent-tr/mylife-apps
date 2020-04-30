'use strict';

import { React, PropTypes, clsx } from 'mylife-tools-ui';
import { makeUrl } from '../tools';

const Video = ({ data, className, ...props }) => (
  <video 
    controls
    src={makeUrl(data)} 
    className={clsx(className)}
    {...props}
  />
);

Video.propTypes = {
  data: PropTypes.object.isRequired,
  className: PropTypes.string,
};

export default Video;

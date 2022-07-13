'use strict';

import { React, PropTypes } from 'mylife-tools-ui';
import { makeUrl } from '../tools';

// 80% because of mobile browser margins
const Video = ({ data, className, ...props }) => (
  <div className={className}>
    <video
      controls
      height='80%'
      width='100%'
      src={makeUrl(data)}
      {...props}
    />
  </div>
);

Video.propTypes = {
  data: PropTypes.object.isRequired,
  className: PropTypes.string,
};

export default Video;

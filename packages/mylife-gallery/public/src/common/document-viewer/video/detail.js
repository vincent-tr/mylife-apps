'use strict';

import { React, PropTypes, mui } from 'mylife-tools-ui';

const VideoDetail = ({ open, document, info, ...props }) => {
  return (
    <mui.Slide direction='left' in={open} mountOnEnter unmountOnExit>
      <div {...props}>
        Detail
      </div>
    </mui.Slide>
  );
};

VideoDetail.propTypes = {
  open: PropTypes.bool.isRequired,
  document: PropTypes.object.isRequired,
  info: PropTypes.object.isRequired,
};

export default VideoDetail;

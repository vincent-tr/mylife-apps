'use strict';

import { React, PropTypes } from 'mylife-tools-ui';
import VideoPlayer from 'react-video-js-player';
import { makeUrl } from '../tools';

const Video = ({ data, ...props }) => {
  // TODO: fix size
  // TOOD: vlc plugin https://github.com/nextcloud/files_videoplayer/issues/9#issuecomment-260556484
  return (
    <div {...props}>
      <VideoPlayer controls src={makeUrl(data)} height={480} width={640} />
    </div>
  );
};

Video.propTypes = {
  data: PropTypes.object.isRequired
};

export default Video;

'use strict';

import { React, PropTypes, clsx, mui } from 'mylife-tools-ui';
import { makeUrl } from '../tools';

// https://github.com/Afterster/videojs-vlc/blob/HEAD/example.html
// https://github.com/videojs/video.js/issues/2750#issuecomment-151939927

// import 'video.js/dist/video-js.css';
// import 'script-loader!video.js/dist/video';
// import 'script-loader!videojs-vlc/lib/videojs-vlc';

const useStyles = mui.makeStyles({
  video: {
    width: '100%',
    height: '100%'
  }
});

const Video = ({ data, className, ...props }) => {
  const classes = useStyles();
  return (
    <video 
      controls
      className={clsx(className)}
      {...props}
    >
      <source src={makeUrl(data)} />
    </video>
  );
};

Video.propTypes = {
  data: PropTypes.object.isRequired,
  className: PropTypes.string,
};

export default Video;

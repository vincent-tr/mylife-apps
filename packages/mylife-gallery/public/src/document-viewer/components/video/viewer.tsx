import { React, PropTypes, mui, clsx } from 'mylife-tools-ui';

const useStyles = mui.makeStyles(theme => ({
  container : {
    backgroundColor : theme.palette.background,
    position: 'relative'
  },
  video : {
    position  : 'relative',
    height    : '100%',
    width     : '100%',
    objectFit : 'scale-down',
  }
}));

const VideoViewer = ({ mediaUrl, className, ...props }) => {
  const classes = useStyles();

  return (
    <div className={clsx(classes.container, className)} {...props}>
      <video controls playsInline
        src={mediaUrl}
        className={classes.video} />
    </div>
  );
};

VideoViewer.propTypes = {
  mediaUrl: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default VideoViewer;

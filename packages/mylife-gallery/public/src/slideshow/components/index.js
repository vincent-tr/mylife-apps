'use strict';

import { React, PropTypes, useMemo, mui, useSelector, useDispatch, useLifecycle } from 'mylife-tools-ui';
import { enter, leave } from '../actions';
import { getSlideshow } from '../selectors';
import { useSlideshowImageView } from '../../common/slideshow-image-view';

const useConnect = () => {
  const dispatch = useDispatch();
  return {
    ...useSelector(state => ({
      slideshow: getSlideshow(state)
    })),
    ...useMemo(() => ({
      enter: (slideshowId) => dispatch(enter(slideshowId)),
      leave: () => dispatch(leave()),
    }), [dispatch])
  };
};

const useStyles = mui.makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 auto',
    overflowY: 'auto'
  }
});

const Slideshow = ({ slideshowId }) => {
  const classes = useStyles();
  const { enter, leave, slideshow } = useConnect();
  useLifecycle(() => enter(slideshowId), leave);
  const { slideshowImages } = useSlideshowImageView(slideshow._id);

  return (
    <div className={classes.container}>
      TODO
    </div>
  );
};

Slideshow.propTypes = {
  slideshowId: PropTypes.string.isRequired
};

export default Slideshow;

'use strict';

import { React, PropTypes, useMemo, mui, useSelector, useDispatch, useLifecycle } from 'mylife-tools-ui';
import { enter, leave } from '../actions';
import { getSlideshow } from '../selectors';
import Content from './content';
import Maximizable from './maximizable';

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

const useStyles = mui.makeStyles(theme => ({
  container: {
    flex: '1 1 auto',
    height: '100%',
    display: 'flex'
  },
  windowed: {
    display: '1 1 auto',
    height: '100%',
    width: '100%',
    background: theme.palette.common.black,
    position: 'relative'
  },
  fullscreen: {
    background: theme.palette.common.black,
    position: 'relative'
  },
  content: {
  }
}));

const Slideshow = ({ slideshowId }) => {
  const classes = useStyles();
  const { enter, leave, slideshow } = useConnect();
  useLifecycle(() => enter(slideshowId), leave);

  return (
    <div className={classes.container}>
      <Maximizable classes={{ windowed: classes.windowed, fullscreen: classes.fullscreen }}>
        <Content slideshow={slideshow} className={classes.content} />
      </Maximizable>
    </div>
  );
};

Slideshow.propTypes = {
  slideshowId: PropTypes.string.isRequired
};

export default Slideshow;

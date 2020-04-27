'use strict';

import { React, PropTypes, mui } from 'mylife-tools-ui';
import ReactPanZoom from 'react-image-pan-zoom-rotate';
import { makeUrl } from '../tools';

const useStyles = mui.makeStyles({
  container: {
    position: 'relative'
  }
});

const Text = ({ data, ...props }) => {
  const classes = useStyles();
  return (
    <div {...props} className={classes.container}>
      <ReactPanZoom image={makeUrl(data)} />
    </div>
  );
};

Text.propTypes = {
  data: PropTypes.object.isRequired
};

export default Text;

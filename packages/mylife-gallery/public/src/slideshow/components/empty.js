'use strict';

import { React, PropTypes, mui, clsx } from 'mylife-tools-ui';
import BaseNone from '../../common/thumbnail/base-none';

const useStyles = mui.makeStyles(theme => ({
  empty: {
  }
}));

const Empty = ({ className }) => {
  const classes = useStyles();
  return (
    <BaseNone className={clsx(classes.empty, className)} />
  );
};

Empty.propTypes = {
  className: PropTypes.string
};

export default Empty;

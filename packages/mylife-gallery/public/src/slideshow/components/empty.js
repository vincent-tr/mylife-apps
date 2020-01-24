'use strict';

import { React, PropTypes, mui, clsx } from 'mylife-tools-ui';
import BaseNone from '../../common/thumbnail/base-none';

console.log(mui.colors.grey[900])

const useStyles = mui.makeStyles(theme => ({
  empty: {
    position: 'absolute',
    right: 0,
    left: 0,
    top: 0,
    bottom: 0,
    margin: 'auto',
    '& > *': {
      color: mui.colors.grey[800]
    },
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

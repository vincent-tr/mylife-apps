'use strict';

import { React, mui, PropTypes } from 'mylife-tools-ui';

const { makeStyles } = mui;

const useStyles = makeStyles({
  container: {
    height: 64,
    display: 'flex',
    alignItems: 'center',
  },
  label: {
    width: 100
  },
  content: {
  },
});

const Row = ({ label, children }) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <mui.Typography className={classes.label}>
        {label}
      </mui.Typography>

      <div className={classes.content}>
        {children}
      </div>
    </div>
  );
};

Row.propTypes = {
  label: PropTypes.string,
  children: PropTypes.oneOfType([ PropTypes.arrayOf(PropTypes.node), PropTypes.node ]),
};

export default Row;

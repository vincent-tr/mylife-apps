'use strict';

import { React, PropTypes, mui } from 'mylife-tools-ui';

const useStyles = mui.makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  label: {
    marginRight: theme.spacing(1)
  },
  children: {
  }
}));

const Field = ({ label, children }) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <mui.Typography className={classes.label}>{label}</mui.Typography>
      <div className={classes.children}>
        {children}
      </div>
    </div>
  );
};

Field.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired
};

export default Field;

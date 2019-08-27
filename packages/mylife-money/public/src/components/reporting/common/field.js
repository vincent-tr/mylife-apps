'use strict';

import { React, PropTypes, mui } from 'mylife-tools-ui';

const useFieldStyles = mui.makeStyles(theme => ({
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
  const classes = useFieldStyles();
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

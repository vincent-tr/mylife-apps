import React from 'react';
import { makeStyles } from '@material-ui/core';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  container: {
    overflowY: 'auto',
  },
  wrapper: {
    height: 0,
  }
}));

// Taken from AutoSizer. Why do we need that ?!
const ListContainer: React.FunctionComponent<{ className?: string }> = ({ className, children }) => {
  const classes = useStyles();
  return (
    <div className={clsx(classes.container, className)}>
      <div className={classes.wrapper}>
        {children}
      </div>
    </div>
  );
};

export default ListContainer;
'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  container: {
    cursor: 'default',
  }
});

const StopPropagationContainer = ({ className, ...props }) => {
  const classes = useStyles();
  return (
    <div
      onClick={event => event.stopPropagation()}
      onFocus={event => event.stopPropagation()}
      className={clsx(classes.container, className)}
      {...props}
    />
  );
};

StopPropagationContainer.propTypes = {
  className: PropTypes.string
};

export default StopPropagationContainer;

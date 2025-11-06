'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import icons from '../../../common/icons';
import { Tooltip, IconButton, Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    alignItems: 'center',
  },
  typography: {
    marginLeft: theme.spacing(2)
  }
}));

const Title = ({ onClose }) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Tooltip title='Retour'>
        <div>
          <IconButton onClick={onClose}>
            <icons.actions.Back />
          </IconButton>
        </div>
      </Tooltip>

      <Typography variant='h6' className={classes.typography}>
        {'Detail de l\'opération'}
      </Typography>
    </div>
  );
};

Title.propTypes = {
  onClose: PropTypes.func.isRequired
};

export default Title;

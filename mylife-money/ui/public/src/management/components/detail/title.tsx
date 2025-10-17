'use strict';

import { React, mui, PropTypes } from 'mylife-tools-ui';
import icons from '../../../common/icons';

const { makeStyles } = mui;

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
      <mui.Tooltip title='Retour'>
        <div>
          <mui.IconButton onClick={onClose}>
            <icons.actions.Back />
          </mui.IconButton>
        </div>
      </mui.Tooltip>

      <mui.Typography variant='h6' className={classes.typography}>
        {'Detail de l\'opération'}
      </mui.Typography>
    </div>
  );
};

Title.propTypes = {
  onClose: PropTypes.func.isRequired
};

export default Title;

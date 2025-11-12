import React from 'react';
import PropTypes from 'prop-types';
import { Button, makeStyles } from '@mui/material';
import clsx from 'clsx';

const useStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

const StepperActions = ({ className, canPrev, canNext, canSkip, canFinish, canCancel, onAction, ...props }) => {
  const classes = useStyles();
  return (
    <div className={clsx(className, classes.root)} {...props} >
      <Button disabled={!canPrev} onClick={() => onAction('prev')} variant='contained'>{'Précédent'}</Button>
      <Button disabled={!canNext} onClick={() => onAction('next')} variant='contained' color='primary'>{'Suivant'}</Button>
      {canSkip && (<Button onClick={() => onAction('skip')} variant='contained'>{'Sauter'}</Button>)}
      {canFinish && (<Button onClick={() => onAction('finish')} variant='contained' color='primary'>{'Terminer'}</Button>)}
      {canCancel && (<Button onClick={() => onAction('cancel')} variant='contained'>{'Annuler'}</Button>)}
    </div>
  );
};

StepperActions.propTypes = {
  className: PropTypes.string,
  canPrev: PropTypes.bool.isRequired,
  canNext: PropTypes.bool.isRequired,
  canSkip: PropTypes.bool.isRequired,
  canFinish: PropTypes.bool.isRequired,
  canCancel: PropTypes.bool.isRequired,
  onAction: PropTypes.func.isRequired
};

export default StepperActions;

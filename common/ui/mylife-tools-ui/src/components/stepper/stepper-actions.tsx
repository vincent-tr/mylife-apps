import React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';

const Root = styled('div')(({ theme }) => ({
  '& > *': {
    margin: theme.spacing(1),
  },
}));

const StepperActions = ({ className, canPrev, canNext, canSkip, canFinish, canCancel, onAction, ...props }) => {
  return (
    <Root className={className} {...props}>
      <Button disabled={!canPrev} onClick={() => onAction('prev')} variant="contained">
        {'Précédent'}
      </Button>
      <Button disabled={!canNext} onClick={() => onAction('next')} variant="contained" color="primary">
        {'Suivant'}
      </Button>
      {canSkip && (
        <Button onClick={() => onAction('skip')} variant="contained">
          {'Sauter'}
        </Button>
      )}
      {canFinish && (
        <Button onClick={() => onAction('finish')} variant="contained" color="primary">
          {'Terminer'}
        </Button>
      )}
      {canCancel && (
        <Button onClick={() => onAction('cancel')} variant="contained">
          {'Annuler'}
        </Button>
      )}
    </Root>
  );
};

StepperActions.propTypes = {
  className: PropTypes.string,
  canPrev: PropTypes.bool.isRequired,
  canNext: PropTypes.bool.isRequired,
  canSkip: PropTypes.bool.isRequired,
  canFinish: PropTypes.bool.isRequired,
  canCancel: PropTypes.bool.isRequired,
  onAction: PropTypes.func.isRequired,
};

export default StepperActions;

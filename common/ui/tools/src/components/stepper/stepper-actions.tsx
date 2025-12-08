import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import React from 'react';
import type { ActionsConfig, ActionType } from './stepper-control';

const Root = styled('div')(({ theme }) => ({
  '& > *': {
    margin: theme.spacing(1),
  },
}));

export interface StepperActionsProps extends ActionsConfig, Omit<React.ComponentProps<'div'>, 'children'> {
  onAction: (value: ActionType) => void;
}

export default function StepperActions({ canPrev, canNext, canSkip, canFinish, canCancel, onAction, ...props }: StepperActionsProps) {
  return (
    <Root {...props}>
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
}

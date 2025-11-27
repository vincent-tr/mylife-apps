import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import React from 'react';

const Root = styled('div')(({ theme }) => ({
  '& > *': {
    margin: theme.spacing(1),
  },
}));

export interface StepperActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  canPrev: boolean;
  canNext: boolean;
  canSkip: boolean;
  canFinish: boolean;
  canCancel: boolean;
  onAction: (action: string) => void;
}

const StepperActions: React.FC<StepperActionsProps> = ({ className, canPrev, canNext, canSkip, canFinish, canCancel, onAction, ...props }) => {
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

export default StepperActions;

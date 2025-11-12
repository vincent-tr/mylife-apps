import React, { FunctionComponent, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Stepper, Step, StepLabel } from '@mui/material';
import { styled } from '@mui/material/styles';
import StepperActions from './stepper-actions';

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
});

const Main = styled(Box)(({ theme }) => ({
  flex: '1 1 auto',
  marginBottom: theme.spacing(1),
  borderColor: theme.palette.divider
}));

interface StepperControlProps {
  className?: string;
  steps: { label: string, actions?, render: (step) => React.ReactNode; }[];
  onStepChanged?: (value, step, activeStep, setActiveStep) => boolean;
  onEnd: (value: 'finish' | 'cancel') => void;
}


const StepperControl: FunctionComponent<StepperControlProps> = ({ className, steps, onStepChanged, onEnd, ...props }) => {
  const [activeStep, setActiveStep] = useState(0);

  const step = steps[activeStep];
  const { render, actions } = step;
  const finalActions = buildActions(activeStep, steps.length, actions);

  const handleAction = (value) => {
    if (onStepChanged) {
      if (onStepChanged(value, step, activeStep, setActiveStep)) {
        // if true => handled
        return;
      }
    }

    switch(value) {
      case 'prev': {
        setActiveStep(activeStep - 1);
        break;
      }

      case 'next': {
        setActiveStep(activeStep + 1);
        break;
      }

      case 'skip': {
        setActiveStep(activeStep + 1);
        break;
      }

      case 'finish': {
        onEnd('finish');
        break;
      }

      case 'cancel': {
        onEnd('cancel');
        break;
      }
    }
  };

  return (
    <Container className={className} {...props}>
      <Stepper activeStep={activeStep}>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepLabel>{step.label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Main borderTop={1} borderBottom={1}>
        {render(step)}
      </Main>

      <StepperActions {...finalActions} onAction={handleAction} />
    </Container>
  );
};

StepperControl.propTypes = {
  className: PropTypes.string,
  steps: PropTypes.arrayOf(
    PropTypes.exact({
      label       : PropTypes.string.isRequired,
      actions     : PropTypes.object,
      render      : PropTypes.func.isRequired
    }).isRequired
  ),
  onStepChanged: PropTypes.func,
  onEnd: PropTypes.func.isRequired
};

export default StepperControl;

function buildActions(currentStep, stepsCount, provided) {
  const isFirst = currentStep === 0;
  const isLast = currentStep === stepsCount - 1;

  const actions = {
    canPrev: true,
    canNext: true,
    canSkip: false,
    canFinish: false,
    canCancel: true,
    ... provided
  };

  if(isFirst) {
    actions.canPrev = false;
  }

  if(isLast) {
    actions.canNext = false;
    actions.canFinish = true;
  }

  return actions;
}

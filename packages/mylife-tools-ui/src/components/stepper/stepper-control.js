'use strict';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Stepper, Step, StepLabel, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import StepperActions from './stepper-actions';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  main: {
    flex: '1 1 auto',
  },
  actions: {
    flex: '1 1 auto',
  }
});

const StepperControl = ({ className, steps, onStepChanged, onEnd, ...props }) => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);

  const step = steps[activeStep];
  const { render, actions } = step;
  const finalActions = buildActions(activeStep, steps.length, actions);

  const handleAction = (value) => {
    if(onStepChanged) {
      if(onStepChanged(value, step, activeStep, setActiveStep)) {
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
    <div className={clsx(className, classes.container)} {...props}>
      <Stepper activeStep={activeStep}>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepLabel>{step.label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <div className={classes.main}>
        {render(step)}
      </div>

      <StepperActions {...finalActions} onAction={handleAction} className={classes.actions} />
    </div>
  );
};

StepperControl.propTypes = {
  className: PropTypes.string,
  steps: PropTypes.arrayOf(
    PropTypes.shape({
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

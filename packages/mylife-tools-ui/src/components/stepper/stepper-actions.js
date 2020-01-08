'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';

const StepperActions = ({ canPrev, canNext, canSkip, canFinish, canCancel, onAction, ...props }) => (
  <div {...props}>
    <Button disabled={!canPrev} onClick={() => onAction('prev')}>{'Précédent'}</Button>
    <Button disabled={!canNext} onClick={() => onAction('next')}>{'Suivant'}</Button>
    {canSkip && (<Button onClick={() => onAction('skip')}>{'Sauter'}</Button>)}
    {canFinish && (<Button onClick={() => onAction('finish')}>{'Terminer'}</Button>)}
    {canCancel && (<Button onClick={() => onAction('cancel')}>{'Annuler'}</Button>)}
  </div>
);

StepperActions.propTypes = {
  canPrev: PropTypes.bool.isRequired,
  canNext: PropTypes.bool.isRequired,
  canSkip: PropTypes.bool.isRequired,
  canFinish: PropTypes.bool.isRequired,
  canCancel: PropTypes.bool.isRequired,
  onAction: PropTypes.func.isRequired
};

export default StepperActions;

'use strict';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';

const StepperActions = ({ canPrev, canNext, canSkip, canFinish, canCancel, onAction }) => (
  <div>
    {canPrev && (<Button onClick={() => onAction('prev')}>{'Précédent'}</Button>)}
    {canNext && (<Button onClick={() => onAction('next')}>{'Suivant'}</Button>)}
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

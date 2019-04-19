'use strict';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button } from '../../button';
import IndeterminableCheckbox from './indeterminable-checkbox';

const BooleanBase = React.forwardRef(({ containerClassName, className, editorClassName, error, enabled, readOnly, nullable, value, onChange, ...props }, ref) => {
  const [focus, setFocus] = useState(false);
  const [hover, setHover] = useState(false);
  const canChange = enabled && !readOnly;
  const showButtons = canChange && (hover || focus);
  const commonClasses = { error, disabled: !enabled, hover, focus };
  const checked = value === true;
  const indeterminate = value === null;

  // without label it does not receive onChange events ?!
  return (
    <label
      className={classNames('editor-container', editorClassName, 'no-border', commonClasses, { 'read-only': readOnly }, containerClassName)}
      disabled={!enabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}>

      <IndeterminableCheckbox
        ref={ref}
        checked={checked}
        indeterminate={indeterminate}
        onChange={() => canChange && onChange(editorToValueChange(nullable, value))}
        className={classNames('editor-component', editorClassName, commonClasses, className)}
        disabled={!enabled}
        readOnly={readOnly}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        { ...props } />

      <div className={classNames('editor-component', editorClassName, commonClasses, {checked, indeterminate}, className)} />

      {showButtons && (
        <React.Fragment>
          {nullable && (<Button className='editor-button' onClick={() => onChange(null)}>x</Button>)}
        </React.Fragment>
      )}

    </label>
  );
});

BooleanBase.displayName = 'BooleanBase';

BooleanBase.propTypes = {
  editorClassName: PropTypes.string,
  containerClassName: PropTypes.string,
  className: PropTypes.string,
  error: PropTypes.bool,
  enabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  nullable: PropTypes.bool,
  value: PropTypes.bool,
  onChange: PropTypes.func.isRequired
};

BooleanBase.defaultProps = {
  error: false,
  enabled: true,
  readOnly: false,
  nullable: false
};

export default BooleanBase;

function editorToValueChange(nullable, current) {
  switch(current) {
    case false: return true;
    case true: return nullable ? null : false;
    case null: return false;
  }
}

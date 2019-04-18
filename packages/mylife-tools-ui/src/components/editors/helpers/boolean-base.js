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
  const commonClasses = { error, disabled: !enabled };

  return (
    <div
      className={classNames('editor-container', editorClassName, 'no-border', commonClasses, { 'read-only': readOnly }, containerClassName)}
      disabled={!enabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}>

      <IndeterminableCheckbox
        ref={ref}
        checked={value === true}
        indeterminate={value === null}
        onChange={() => canChange && onChange(editorToValueChange(nullable, value))}
        className={classNames('editor-component', editorClassName, commonClasses, className)}
        disabled={!enabled}
        readOnly={readOnly}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        { ...props } />

      {showButtons && (
        <React.Fragment>
          {nullable && (<Button className='editor-button' onClick={() => onChange(null)}>x</Button>)}
        </React.Fragment>
      )}

    </div>
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

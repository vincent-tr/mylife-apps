'use strict';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { createValueToEditor, createEditorToValue } from './helpers';
import { Button } from '../button';

import './integer-input.scss';

const valueToEditor = createValueToEditor(x => x.toString());
const editorToValue = createEditorToValue(parseIntOrZero, 0);

const IntegerInput = React.forwardRef(({ containerClassName, className, enabled, readOnly, nullable, value, onChange, min, max, ...props }, ref) => {
  const [focus, setFocus] = useState(false);
  const [hover, setHover] = useState(false);
  const showButtons = enabled && !readOnly && (hover || focus);

  const handleFocus = (e) => {
    setFocus(true);
    if(!readOnly && enabled) {
      e.target.select();
    }
  };

  return (
    <div
      className={classNames('editor-container', 'editor-container-integer-input', { disabled: !enabled, 'read-only': readOnly }, containerClassName)}
      disabled={!enabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}>

      <input
        type='number'
        ref={ref}
        value={valueToEditor(nullable, value)}
        onChange={e => onChange(limitToRange(editorToValue(nullable, e.target.value), min, max))}
        className={classNames('editor-base', 'editor-integer-input', className)}
        disabled={!enabled}
        readOnly={readOnly}
        onFocus={handleFocus}
        onBlur={() => setFocus(false)}
        { ...props } />

      {showButtons && (
        <React.Fragment>
          <Button className='editor-button' onClick={() => onChange(diffValue(value, min, max, 1))}>+</Button>
          <Button className='editor-button' onClick={() => onChange(diffValue(value, min, max, -1))}>-</Button>
          {nullable && (<Button className='editor-button' onClick={() => onChange(null)}>x</Button>)}
        </React.Fragment>
      )}

    </div>
  );
});

IntegerInput.displayName = 'Integer';

IntegerInput.propTypes = {
  containerClassName: PropTypes.string,
  className: PropTypes.string,
  enabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  nullable: PropTypes.bool,
  value: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
};

IntegerInput.defaultProps = {
  enabled: true,
  readOnly: false,
  nullable: false,
  min: null,
  max: null,
};

export default IntegerInput;

function parseIntOrZero(value) {
  const result = parseInt(value);
  return isNaN(result) ? 0 : result;
}

function limitToRange(value, min, max) {
  if(value === null) {
    return value;
  }
  if(min !== null && value < min) {
    return min;
  }
  if(max !== null && value > max) {
    return max;
  }
  return value;
}

function diffValue(value, min, max, diff) {
  if(value === null) {
    if(diff > 0 && typeof(min) === 'number') {
      return min;
    }
    if(diff < 0 && typeof(max) === 'number') {
      return max;
    }
    return 0;
  }
  return limitToRange(value + diff, min, max);
}

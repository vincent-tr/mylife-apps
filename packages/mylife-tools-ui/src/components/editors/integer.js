'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { createValueToEditor, createEditorToValue } from './helpers';

import './integer.scss';

const valueToEditor = createValueToEditor(x => x.toString());
const editorToValue = createEditorToValue(parseIntOrZero, 0);

const Integer = React.forwardRef(({ containerClassName, className, enabled, readOnly, nullable, value, onChange, min, max, ...props }, ref) => (
  <div className={classNames('editor-container', { disabled: !enabled, 'read-only': readOnly }, containerClassName)} disabled={!enabled}>
    <input
      type='text'
      ref={ref}
      value={valueToEditor(nullable, value)}
      onChange={e => onChange(limitToRange(editorToValue(nullable, e.target.value), min, max))}
      className={classNames('editor-base', 'editor-integer', className)}
      disabled={!enabled}
      readOnly={readOnly}
      { ...props }>
    </input>
    <button onClick={() => onChange(diffValue(value, min, max, 1))}>+</button>
    <button onClick={() => onChange(diffValue(value, min, max, -1))}>-</button>
  </div>
));

Integer.displayName = 'Integer';

Integer.propTypes = {
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

Integer.defaultProps = {
  enabled: true,
  readOnly: false,
  nullable: false,
  min: null,
  max: null,
};

export default Integer;

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
    return null;
  }
  return limitToRange(value + diff, min, max);
}

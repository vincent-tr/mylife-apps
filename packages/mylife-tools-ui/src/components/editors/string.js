'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './string.scss';

const String = React.forwardRef(({ className, enabled, readOnly, nullable, value, onChange, ...props }, ref) => (
  <input
    type='text'
    ref={ref}
    value={valueToEditor(nullable, value)}
    onChange={e => onChange(editorToValue(nullable, e.target.value))}
    className={classNames('editor-base', 'editor-string', className)}
    disabled={!enabled}
    readOnly={readOnly}
    { ...props }/>
));

String.displayName = 'String';

String.propTypes = {
  className: PropTypes.string,
  enabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  nullable: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired
};

String.defaultProps = {
  enabled: true,
  readOnly: false,
  nullable: false
};

export default String;

function valueToEditor(nullable, value) {
  if(!nullable && value === null) {
    if(value === null) {
      throw new Error('Field is not nullable but value is null');
    }
    return value;
  }

  return value === null ? '' : value;
}

function editorToValue(nullable, value) {
  if(!nullable) {
    return value;
  }

  return value === '' ? null : value;
}

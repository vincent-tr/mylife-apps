'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { createValueToEditor, createEditorToValue } from './helpers';

// import './integer.scss';

const valueToEditor = createValueToEditor(x => x.toString());
const editorToValue = createEditorToValue(parseIntOrZero, 0);

const Integer = React.forwardRef(({ className, enabled, readOnly, nullable, value, onChange, ...props }, ref) => (
  <input
    type='text'
    ref={ref}
    value={valueToEditor(nullable, value)}
    onChange={e => onChange(editorToValue(nullable, e.target.value))}
    className={classNames('editor-base', 'editor-integer', className)}
    disabled={!enabled}
    readOnly={readOnly}
    { ...props }/>
));

Integer.displayName = 'Integer';

Integer.propTypes = {
  className: PropTypes.string,
  enabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  nullable: PropTypes.bool,
  value: PropTypes.number,
  onChange: PropTypes.func.isRequired
};

Integer.defaultProps = {
  enabled: true,
  readOnly: false,
  nullable: false
};

export default Integer;

function parseIntOrZero(value) {
  const result = parseInt(value);
  return isNaN(result) ? 0 : result;
}

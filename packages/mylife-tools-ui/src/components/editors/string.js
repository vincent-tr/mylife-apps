'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { createValueToEditor, createEditorToValue } from './helpers';

import './string.scss';

const valueToEditor = createValueToEditor(x => x);
const editorToValue = createEditorToValue(x => x, '');

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

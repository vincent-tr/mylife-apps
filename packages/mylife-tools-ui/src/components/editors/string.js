'use strict';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { createValueToEditor, createEditorToValue } from './helpers';

import './string.scss';

const valueToEditor = createValueToEditor(x => x);
const editorToValue = createEditorToValue(x => x, '');

const String = React.forwardRef(({ containerClassName, className, enabled, readOnly, nullable, value, onChange, ...props }, ref) => {
  const [focus, setFocus] = useState(false);

  return (
    <div
      className={classNames('editor-container', { disabled: !enabled, 'read-only': readOnly, focus }, containerClassName)}
      disabled={!enabled}>

      <input
        type='text'
        ref={ref}
        value={valueToEditor(nullable, value)}
        onChange={e => onChange(editorToValue(nullable, e.target.value))}
        className={classNames('editor-base', 'editor-string', className)}
        disabled={!enabled}
        readOnly={readOnly}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        { ...props }/>
      
    </div>
  );
});

String.displayName = 'String';

String.propTypes = {
  containerClassName: PropTypes.string,
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

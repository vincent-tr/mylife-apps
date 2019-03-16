'use strict';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { createValueToEditor, createEditorToValue } from './helpers';
import { Button } from '../button';

import './string-textbox.scss';

const valueToEditor = createValueToEditor(x => x);
const editorToValue = createEditorToValue(x => x, '');

const StringTextbox = React.forwardRef(({ containerClassName, className, error, enabled, readOnly, nullable, value, onChange, maxLength, ...props }, ref) => {
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
      className={classNames('editor-container', 'string-textbox', { error, disabled: !enabled, 'read-only': readOnly, focus }, containerClassName)}
      disabled={!enabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}>

      <input
        type='text'
        ref={ref}
        value={valueToEditor(nullable, value)}
        onChange={e => onChange(limitToLength(editorToValue(nullable, e.target.value), maxLength, value))}
        className={classNames('editor-component', 'string-textbox', className)}
        disabled={!enabled}
        readOnly={readOnly}
        onFocus={handleFocus}
        onBlur={() => setFocus(false)}
        { ...props }/>

      {showButtons && (
        <React.Fragment>
          {nullable && (<Button className='editor-button' onClick={() => onChange(null)}>x</Button>)}
        </React.Fragment>
      )}

    </div>
  );
});

StringTextbox.displayName = 'StringTextbox';

StringTextbox.propTypes = {
  containerClassName: PropTypes.string,
  className: PropTypes.string,
  error: PropTypes.bool,
  enabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  nullable: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  maxLength: PropTypes.number
};

StringTextbox.defaultProps = {
  error: false,
  enabled: true,
  readOnly: false,
  nullable: false,
  maxLength: null
};

export default StringTextbox;

function limitToLength(value, maxLength, oldValue) {
  if(value === null) {
    return value;
  }
  if(maxLength === null || value.length <= maxLength) {
    return value;
  }
  return oldValue;
}

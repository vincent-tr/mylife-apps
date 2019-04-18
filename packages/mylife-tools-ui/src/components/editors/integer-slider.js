'use strict';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { createValueToEditor, createEditorToValue } from './helpers';
import { Button } from '../button';

import './integer-slider.scss';

const valueToEditor = createValueToEditor(x => x.toString());
const editorToValue = createEditorToValue(parseInt, 0);

const IntegerSlider = React.forwardRef(({ containerClassName, className, error, enabled, readOnly, nullable, value, onChange, min, max, ...props }, ref) => {
  const range = max - min;
  const [focus, setFocus] = useState(false);
  const [hover, setHover] = useState(false);
  const canChange = enabled && !readOnly;
  const showButtons = canChange && (hover || focus);
  const commonClasses = { error, disabled: !enabled };

  const handleFocus = (e) => {
    setFocus(true);
    if(!readOnly && enabled) {
      e.target.select();
    }
  };

  return (
    <div
      className={classNames('editor-container', 'integer-slider', 'no-border', commonClasses, { 'read-only': readOnly }, containerClassName)}
      disabled={!enabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}>

      <input
        type='range'
        ref={ref}
        min={min}
        max={max}
        value={valueToEditor(nullable, value)}
        onChange={e => canChange /* seems that chrome readonly on input range is broken */ && onChange(editorToValue(nullable, e.target.value))}
        className={classNames('editor-component', 'integer-slider', `range-${range}`, commonClasses, { 'value-null': value === null }, className)}
        disabled={!enabled}
        readOnly={readOnly}
        onFocus={handleFocus}
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

IntegerSlider.displayName = 'IntegerSlider';

IntegerSlider.propTypes = {
  containerClassName: PropTypes.string,
  className: PropTypes.string,
  error: PropTypes.bool,
  enabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  nullable: PropTypes.bool,
  value: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
};

IntegerSlider.defaultProps = {
  error: false,
  enabled: true,
  readOnly: false,
  nullable: false
};

export default IntegerSlider;

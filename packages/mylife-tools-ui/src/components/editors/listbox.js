'use strict';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Button } from '../button';
import { useDropdownBehavior } from './helpers/dropdown-behavior';

import './listbox.scss';

const Listbox = React.forwardRef(({ containerClassName, className, error, enabled, readOnly, nullable, value, onChange, values, ...props }, ref) => {
  const [focus, setFocus] = useState(false);
  const [hover, setHover] = useState(false);
  const [opened, setOpen, setClose, toggle, containerRef] = useDropdownBehavior();
  const canChange = enabled && !readOnly;
  const commonClasses = { error, disabled: !enabled, 'read-only': readOnly, hover, focus };

  const handleKeyDown = (event) => {
    switch(event.key) {
      case 'Enter':
      case ' ':
        toggle();
        break;
    }
  };

  return (
    <div
      ref={containerRef}
      className={classNames('editor-container', 'listbox', commonClasses, containerClassName)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}>

      <input
        type='text'
        ref={ref}
        value={'toto'}
        className={classNames('editor-component', 'listbox', className)}
        disabled={!enabled}
        readOnly={true}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onMouseDown={toggle}
        onTouchEnd={toggle}
        onKeyDown={handleKeyDown}
        { ...props }/>

      {opened && (
        <div>Popup</div>
      )}

    </div>
  );
});

Listbox.displayName = 'Listbox';

Listbox.propTypes = {
  containerClassName: PropTypes.string,
  className: PropTypes.string,
  error: PropTypes.bool,
  enabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  nullable: PropTypes.bool,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  values: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any.isRequired,
      text: PropTypes.node.isRequired,
      icon: PropTypes.node
    }).isRequired
  ).isRequired
};

Listbox.defaultProps = {
  error: false,
  enabled: true,
  readOnly: false,
  nullable: false
};

export default Listbox;

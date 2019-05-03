'use strict';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useDropdownBehavior } from './helpers/dropdown-behavior';

import './date-picker.scss';

const DatePicker = React.forwardRef(({ containerClassName, className, error, enabled, readOnly, nullable, value, onChange, tabIndex, ...props }, ref) => {
  const [focus, setFocus] = useState(false);
  const [hover, setHover] = useState(false);
  const [containerRef, componentRef, opened, toggle, setSelect] = useDropdownBehavior(ref);
  const canChange = enabled && !readOnly;
  const commonClasses = { error, disabled: !enabled, 'read-only': readOnly, hover, focus, opened };

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
      className={classNames('editor-container', 'date-picker', commonClasses, containerClassName)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}>

      <div
        ref={componentRef}
        className={classNames('editor-component', 'date-picker', commonClasses, className)}
        disabled={!enabled}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onMouseDown={canChange ? toggle : undefined}
        onTouchEnd={canChange ? toggle : undefined}
        onKeyDown={canChange ? handleKeyDown : undefined}
        tabIndex={enabled ? tabIndex : undefined}
        { ...props }>

        <div className='value'>
          {formatDate(value)}
        </div>

        {opened && (
          <div className={'popup'}>
            Popup
          </div>
        )}
      </div>

    </div>
  );
});

DatePicker.displayName = 'DatePicker';

DatePicker.propTypes = {
  containerClassName: PropTypes.string,
  className: PropTypes.string,
  error: PropTypes.bool,
  enabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  nullable: PropTypes.bool,
  tabIndex: PropTypes.number,
  value: PropTypes.instanceOf(Date),
  onChange: PropTypes.func.isRequired
};

DatePicker.defaultProps = {
  error: false,
  enabled: true,
  readOnly: false,
  nullable: false,
  tabIndex: 0
};

export default DatePicker;

function formatDate(value) {
  if(!value) {
    return ' ';
  }

  // TODO: localization
  const day = value.getDate();
  const month = value.getMonth() + 1;
  const year = value.getFullYear();
  return `${day}/${month}/${year}`;
}

'use strict';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useDropdownBehavior } from './helpers/dropdown-behavior';
import { Icon } from '../icon';

import './listbox.scss';

const Item = ({ text, icon }) => (
  <div className={'item'}>
    {icon && <div className='icon'><Icon src={icon}/></div>}
    <div className='text'>{text}</div>
  </div>
);

Item.propTypes = {
  icon: PropTypes.string,
  text: PropTypes.node.isRequired,
};

const Listbox = React.forwardRef(({ containerClassName, className, error, enabled, readOnly, nullable, value, onChange, values, tabIndex, ...props }, ref) => {
  const [focus, setFocus] = useState(false);
  const [hover, setHover] = useState(false);
  const [opened, setOpen, setClose, toggle, containerRef] = useDropdownBehavior();
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

  const items = [ ... values ];
  if(nullable) {
    items.unshift({ text: ' ', value: null });
  }

  const current = items.find(item => Object.is(item.value, value));
  if(!current) {
    throw new Error(`Current value '${value}' not found in values`);
  }

  return (
    <div
      ref={containerRef}
      className={classNames('editor-container', 'listbox', commonClasses, containerClassName)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}>

      <div
        ref={ref}
        className={classNames('editor-component', 'listbox', commonClasses, className)}
        disabled={!enabled}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onMouseDown={canChange ? toggle : undefined}
        onTouchEnd={canChange ? toggle : undefined}
        onKeyDown={canChange ? handleKeyDown : undefined}
        tabIndex={enabled ? tabIndex : undefined}
        { ...props }>
        <Item {...current} />
      </div>

      {opened && (
        <div className={'popup'}>
          {items.map(item => (<Item key={makeKey(item)} {...item} />))}
        </div>
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
  tabIndex: PropTypes.number,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  values: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any.isRequired,
      text: PropTypes.node.isRequired,
      icon: PropTypes.string
    }).isRequired
  ).isRequired
};

Listbox.defaultProps = {
  error: false,
  enabled: true,
  readOnly: false,
  nullable: false,
  tabIndex: 0
};

export default Listbox;

function makeKey(item) {
  return item.value === null ? '<null>' : item.value.toString();
}

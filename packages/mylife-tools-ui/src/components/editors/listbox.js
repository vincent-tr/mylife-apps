'use strict';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useDropdownBehavior } from './helpers/dropdown-behavior';
import { Icon } from '../icon';

import './listbox.scss';

const Listbox = React.forwardRef(({ containerClassName, className, error, enabled, readOnly, nullable, value, onChange, values, tabIndex, ...props }, ref) => {
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

  const createPopupItem = item => {
    const handler = () => {
      setSelect();
      onChange(item.value);
    };

    // TODO: keyboard navigation ?
    const props = { onMouseDown: handler, onTouchEnd: handler };
    return makeItem(item, props);
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
        ref={componentRef}
        className={classNames('editor-component', 'listbox', commonClasses, className)}
        disabled={!enabled}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onMouseDown={canChange ? toggle : undefined}
        onTouchEnd={canChange ? toggle : undefined}
        onKeyDown={canChange ? handleKeyDown : undefined}
        tabIndex={enabled ? tabIndex : undefined}
        { ...props }>
        {makeItem(current)}

        {opened && (
          <div className='popup'>
            {items.map(createPopupItem)}
          </div>
        )}
      </div>

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
      icon: PropTypes.node
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

const Item = ({ text, icon, ...props }) => (
  <div className='item' { ... props }>
    {icon && <div className='icon'>{icon}</div>}
    <div className='text'>{text}</div>
  </div>
);

Item.propTypes = {
  icon: PropTypes.node,
  text: PropTypes.node.isRequired,
};

function makeItem(item, props = {}) {
  const { value, text, icon } = item;
  const key = value === null ? '<null>' : value.toString();
  return (
    <Item key={key} text={text} icon={icon} {...props} />
  );
}

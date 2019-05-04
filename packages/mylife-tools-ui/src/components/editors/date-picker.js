'use strict';

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { useDropdownBehavior } from './helpers/dropdown-behavior';
import { Button } from '../button';

import './date-picker.scss';

const PopupButton = ({ ... props }) => (
  <Button onMouseDown={e => e.stopPropagation()} onTouchEnd={e => e.stopPropagation()} {...props} />
);

const Popup = ({ nullable, initialValue, onSelect }) => {
  const [current, setCurrent] = useState(firstDayOfMonth(initialValue || new Date()));
  const createCellClickHandler = cell => e => {
    e.stopPropagation();
    onSelect(cell.value);
  };

  return (
    <div className='popup'>
      <div className='header'>
        {nullable && (
          <PopupButton onClick={() => onSelect(null)}>null</PopupButton>
        )}
        <PopupButton onClick={() => setCurrent(addMonths(current, -1))}>month prev</PopupButton>
        <PopupButton onClick={() => setCurrent(addYears(current, -1))}>year prev</PopupButton>
        <span>{formatMonth(current)}</span>
        <PopupButton onClick={() => setCurrent(addMonths(current, 1))}>month next</PopupButton>
        <PopupButton onClick={() => setCurrent(addYears(current, 1))}>year next</PopupButton>
      </div>
      <table className='table'>
        <thead>
          <tr>
            {/* TODO: localization */}
            <th>L</th>
            <th>M</th>
            <th>M</th>
            <th>J</th>
            <th>V</th>
            <th>S</th>
            <th>D</th>
          </tr>
        </thead>
        <tbody>
          {getDaysTable(current).map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td key={colIndex}>
                  {cell.visible && (
                    <PopupButton primary onClick={createCellClickHandler(cell)}>
                      {cell.content}
                    </PopupButton>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

Popup.propTypes = {
  nullable: PropTypes.bool,
  initialValue: PropTypes.instanceOf(Date),
  onSelect: PropTypes.func.isRequired
};

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

  const handleSelect = (selectedValue) => {
    setSelect();
    onChange(selectedValue);
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
          <Popup nullable={nullable} initialValue={value} onSelect={handleSelect} />
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
  const day = value.toLocaleString('fr-fr', { day: '2-digit' });
  const month = value.toLocaleString('fr-fr', { month: '2-digit' });
  const year = value.toLocaleString('fr-fr', { year: 'numeric' });
  return `${day}/${month}/${year}`;
}

function firstDayOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function lastDayOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function addMonths(date, inc) {
  return new Date(date.getFullYear(), date.getMonth() + inc, date.getDay());
}

function addYears(date, inc) {
  return new Date(date.getFullYear() + inc, date.getMonth(), date.getDay());
}

function formatMonth(value) {
  // TODO: localization
  const month = value.toLocaleString('fr-fr', { month: 'long' });
  const year = value.toLocaleString('fr-fr', { year: 'numeric' });
  return `${month} ${year}`;
}

function getDaysTable(value) {
  // TODO: localization
  const firstDayOfWeek = 1;

  const firstDayDate = firstDayOfMonth(value);
  const lastDayDate = lastDayOfMonth(value);
  const day = firstDayDate.getDay();
  const daysInMonth = lastDayDate.getDate();
  let weeksInMonth = Math.ceil(daysInMonth / 7);
  const prevMonth = new Date(value.getYear(), value.getMonth() - 1, 1);
  const prevDaysInMonth = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 0).getDate();

  // The real first day in relation to the sequence of calendar days (array index)
  let realFirstWeekDay = day - firstDayOfWeek;
  // if the real first day is under 0, we want to shift it a week back
  if (realFirstWeekDay < 0) {
    realFirstWeekDay = 7 - day - firstDayOfWeek;
    ++weeksInMonth;
  }
  if(realFirstWeekDay + daysInMonth > 7 * weeksInMonth) {
    ++weeksInMonth;
  }

  let cellDay = 0;
  let nextMonthDay = 0;
  const rows = [];

  for(let rowIndex = 0; rowIndex < weeksInMonth; ++rowIndex) {
    const cells = [];
    for(let colIndex = 0; colIndex < 7; ++colIndex) {
      const i = rowIndex * 7 + colIndex;
      const value = new Date(firstDayDate);
      let day;
      let visible = true;

      if (i >= realFirstWeekDay && cellDay < daysInMonth) {
        cellDay += 1;
        day = cellDay;
      } else if (i < realFirstWeekDay) {
        day = prevDaysInMonth - realFirstWeekDay + i + 1;
        value.setMonth(value.getMonth() - 1);
        visible = false;
      } else if (i >= daysInMonth) {
        nextMonthDay += 1;
        day = nextMonthDay;
        value.setMonth(value.getMonth() + 1);
        visible = false;
      }

      value.setDate(day);
      const cell = { content: day.toString(), value, visible };
      cells.push(cell);
    }
    rows.push(cells);
  }
  return rows;
}

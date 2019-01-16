'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './group-box.scss';

const GroupBox = ({ className, containerClassName, titleClassName, title, children, }) => (
  <div className={classNames('group-box-container', containerClassName)}>
    <div className={classNames('title', titleClassName)}>
      {formatTitle(title)}
    </div>
    <div className={classNames('content', className)}>
      {children}
    </div>
  </div>
);

GroupBox.propTypes = {
  className: PropTypes.string,
  containerClassName: PropTypes.string,
  titleClassName: PropTypes.string,
  title: PropTypes.node,
  children: PropTypes.oneOfType([ PropTypes.arrayOf(PropTypes.node), PropTypes.node ])
};

export default GroupBox;

function formatTitle(title) {
  if(typeof title !== 'string') {
    return title;
  }
  return (<h3>{title}</h3>);
}

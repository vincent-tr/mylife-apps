'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Box, Content } from './tools';

import './group-box.scss';

const GroupBox = ({ stretch, className, containerClassName, titleClassName, title, children }) => (
  <Box stretch={stretch} className={classNames('group-box-container', containerClassName)}>
    <div className={classNames('title', titleClassName)}>
      {formatTitle(title)}
    </div>
    <Content className={classNames('content', className)}>
      {children}
    </Content>
  </Box>
);

GroupBox.propTypes = {
  stretch: PropTypes.bool,
  className: PropTypes.string,
  containerClassName: PropTypes.string,
  titleClassName: PropTypes.string,
  title: PropTypes.node.isRequired,
  children: PropTypes.oneOfType([ PropTypes.arrayOf(PropTypes.node), PropTypes.node ])
};

export default GroupBox;

function formatTitle(title) {
  if(typeof title !== 'string') {
    return title;
  }
  return (<h3>{title}</h3>);
}

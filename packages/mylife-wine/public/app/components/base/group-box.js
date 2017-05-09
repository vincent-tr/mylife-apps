'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import * as mui from 'material-ui';

const styles = {
  box: {
    margin   : 10,
    position : 'relative'
  },
  title: {
    fontFamily      : 'Roboto, sans-serif',
    fontSize        : 20,
    color           : 'rgba(0, 0, 0, 0.4)',
    backgroundColor : '#E8E8E8',
    padding         : 20,
    margin          : 0
  },
  container: {
    height: '100%',
    width: '100%',
    position: 'absolute'
  },
  wrapper: {
    height: 'calc(100% - 62px)',
    width: '100%'
  }
};

function mergeStyle(baseStyle, additionalStyle) {
  return Object.assign({}, baseStyle, additionalStyle);
}

const GroupBox = ({ children, title, style, titleStyle, ...props}) => (
  <mui.Paper style={mergeStyle(styles.box, style)} {...props}>
    <div style={styles.container}>
      <h3 style={mergeStyle(styles.title, titleStyle)}>{title}</h3>
      <div style={styles.wrapper}>
        {children}
      </div>
    </div>
  </mui.Paper>
);

GroupBox.propTypes = {
  title      : PropTypes.node,
  children   : PropTypes.node,
  style      : PropTypes.object,
  titleStyle : PropTypes.object,
};

export default GroupBox;

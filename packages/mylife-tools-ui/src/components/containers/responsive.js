'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import MediaQuery from 'react-responsive';

const Responsive = ({ large, laptop, tablet, mobile, portrait, landscape, children, ...props }) => (
  <MediaQuery query={getQuery({ large, laptop, tablet, mobile, portrait, landscape })} {...props}>
    {children}
  </MediaQuery>
);

function getQuery({ large, laptop, tablet, mobile, portrait, landscape }) {
  const widthRules = getWidth({ large, laptop, tablet, mobile });
  const orientationRules = getOrientation({ portrait, landscape });
  if(!widthRules && !orientationRules) {
    return;
  }
  if(!widthRules || !orientationRules) {
    const rules = (widthRules || orientationRules);
    if(rules.length === 1) {
      return rules[0];
    }
    return rules.join(', ');
  }

  const finalRules = [];
  for(const widthRule of widthRules) {
    for(const orientationRule of orientationRules) {
      finalRules.push(`${widthRule} and ${orientationRule}`);
    }
  }
  return finalRules.join(', ');
}

function getWidth({ large, laptop, tablet, mobile }) {
  const rules = [];
  if(large) {
    rules.push('(min-width: 1824px)');
  }
  if(laptop) {
    rules.push('(min-width: 992px) and (max-width: 1823px)');
  }
  if(tablet) {
    rules.push('(min-width: 768px) and (max-width: 991px)');
  }
  if(mobile) {
    rules.push('(max-width: 767px)');
  }

  if(rules.length) {
    return rules;
  }
}

function getOrientation({ portrait, landscape }) {
  const rules = [];
  if(portrait) {
    rules.push('(orientation: portrait)');
  }
  if(landscape) {
    rules.push('(orientation: landscape)');
  }

  if(rules.length) {
    return rules;
  }
}

Responsive.propTypes = {
  large: PropTypes.bool,
  laptop: PropTypes.bool,
  tablet: PropTypes.bool,
  mobile: PropTypes.bool,
  portrait: PropTypes.bool,
  landscape: PropTypes.bool,
  children: PropTypes.oneOfType([ PropTypes.arrayOf(PropTypes.node), PropTypes.node, PropTypes.func ])
};

export default Responsive;

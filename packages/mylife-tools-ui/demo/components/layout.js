'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { components } from 'mylife-tools-ui';
import icon from '../icon.ico';
import { setView } from '../actions/view';
import { getView } from '../selectors/view';
import * as views from './views';

function buildMenuItem(id, menuClick, type = 'item') {
  const meta = views[id].meta;
  return {
    id,
    text: meta.title,
    icon: meta.icon && <components.Icon src={meta.icon}/>,
    type,
    onClick: menuClick
  };
}

function buildComponentItems(menuClick) {
  const res = [];
  for(const [ id, View ] of Object.entries(views)) {
    const { meta } = View;
    if(meta.exclude) {
      continue;
    }
    res.push(buildMenuItem(id, menuClick));
  }
  return res;
}

const Layout = ({ viewName, viewIcon, children, menuClick, logoClick }) => (
  <components.Layout logoName={<h1>Demo</h1>}
    logoIcon={<components.Icon src={icon}/>}
    logoOnClick={logoClick}
    viewName={<h2>{viewName}</h2>}
    viewIcon={viewIcon && <components.Icon src={viewIcon}/>}
    menu={[
      buildMenuItem('main', menuClick, 'header'),
      { id: 'components', text: 'Components', type: 'header' },
      ... buildComponentItems(menuClick)
    ]}
    footer={'footer'}>
    {children}
  </components.Layout>
);

Layout.propTypes = {
  viewName: PropTypes.string.isRequired,
  viewIcon: PropTypes.string,
  children: components.Layout.propTypes.children,
  menuClick: PropTypes.func.isRequired,
  logoClick: PropTypes.func.isRequired
};

const mapStateToProps = (state) => {
  const { meta } = views[getView(state)];
  return {
    viewName: meta.title,
    viewIcon: meta.icon
  };
};

const mapDispatchToProps = (dispatch) => ({
  menuClick : id => dispatch(setView(id)),
  logoClick : () => dispatch(setView('default'))
});

export default connect(mapStateToProps, mapDispatchToProps)(Layout);

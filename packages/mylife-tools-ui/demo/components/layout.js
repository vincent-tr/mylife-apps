'use strict';

import React from 'react';
import { components } from 'mylife-tools-ui';
import { setView } from '../actions/view';
import { getView } from '../selectors/view';
import * as views from './views';
import { createUseConnect } from 'react-use-redux';

const useConnect = createUseConnect(
  (state) => {
    const { meta } = views[getView(state)];
    return {
      viewName: meta.title,
      viewIcon: meta.icon
    };
  },
  (dispatch) => ({
    menuClick : id => dispatch(setView(id)),
    logoClick : () => dispatch(setView('main'))
  })
);

const Layout = ({ children }) => {
  const { viewName, viewIcon, menuClick, logoClick } = useConnect();
  return (
    <components.Layout logoName={<h1>Demo</h1>}
      logoIcon={<components.MylifeLogo />}
      logoOnClick={logoClick}
      viewName={<h2>{viewName}</h2>}
      viewIcon={viewIcon}
      menu={buildMenu(menuClick)}
      footer={'footer'}>
      {children}
    </components.Layout>
  );
};

Layout.propTypes = {
  children: components.Layout.propTypes.children
};

export default Layout;

function buildMenuItem(id, view) {
  const { menu, icon, title } = view.meta;
  return {
    id,
    text: title,
    icon,
    type: menu ? 'item' : 'header',
    onClick: true
  };
}

function buildMenuHeader(title) {
  return {
    id: title.toLowerCase(),
    text: title,
    type: 'header'
  };
}

function buildMenuTemplate() {
  const tree = {};
  for(const [id, view] of Object.entries(views)) {
    const { menu } = view.meta;
    if(!menu) {
      tree[id] = {
        header: buildMenuItem(id, view),
        items: []
      };
      continue;
    }

    let leaf = tree[menu];
    if(!leaf) {
      leaf = tree[menu] = {
        header: buildMenuHeader(menu),
        items: []
      };
    }
    leaf.items.push(buildMenuItem(id, view));
  }

  const template = [];
  for(const leaf of Object.values(tree)) {
    template.push(leaf.header);
    for(const item of leaf.items) {
      template.push(item);
    }
  }
  return template;
}

const menuTemplate = buildMenuTemplate();

function buildMenu(menuClick) {
  return menuTemplate.map(({ onClick, ...item }) => {
    if(onClick) {
      item.onClick = menuClick;
    }
    return item;
  });
}

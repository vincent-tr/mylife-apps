'use strict';

import React from 'react';
import { components, modules } from 'mylife-tools-ui';
import * as views from './views';

const routes = buildRoutes();
const menu = buildMenu();

const App = () => (
  <modules.routing.LayoutRouter
    logoName={<h1>Demo</h1>}
    logoIcon={<components.MylifeLogo />}
    menu={menu}
    footer={'footer'}>
    {routes}
  </modules.routing.LayoutRouter>
);

export default App;

function buildRoutes()  {
  return Object.entries(views).map(([id, View]) => (
    <modules.routing.RouteView
      key={id}
      location={id === 'main' ? '/' : `/${id}`}
      name={<h2>{View.meta.title}</h2>}
      icon={View.meta.icon}>
      <View />
    </modules.routing.RouteView>
  ));
}

function buildMenuItem(id, view) {
  const { menu, icon, title } = view.meta;
  return {
    id,
    text: title,
    icon,
    type: menu ? 'item' : 'header',
    location: id === 'main' ? '/' : `/${id}`
  };
}

function buildMenuHeader(title) {
  return {
    id: title.toLowerCase(),
    text: title,
    type: 'header'
  };
}

function buildMenu() {
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

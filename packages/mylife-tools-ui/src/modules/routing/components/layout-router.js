'use strict';

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Layout } from '../../../components/layout';
import { useRoutingConnect } from './behaviors';
import PathToRegex from 'path-to-regex';

const LayoutRouter = ({ routes, menu, ...props }) => {
  const { location, navigate } = useRoutingConnect();
  const mappedMenu = mapMenu({ navigate, menu });
  const routesInfo = useMemo(() => new RoutesInfo(routes), [routes]);
  const routeMatch = routesInfo.findMatch(location);

  return (
    <Layout
      onMainClick={() => navigate('/')}
      viewName={routeMatch.name}
      viewIcon={routeMatch.icon}
      menu={mappedMenu}
      {...props}>
      {routeMatch.render()}
    </Layout>
  );
};

LayoutRouter.propTypes = {
  menu: PropTypes.arrayOf(
    PropTypes.shape({
      id       : PropTypes.string.isRequired,
      text     : PropTypes.string.isRequired,
      icon     : PropTypes.elementType,
      location : PropTypes.string
    }).isRequired
  ),
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      location: PropTypes.string.isRequired,
      name: Layout.propTypes.viewName,
      icon: Layout.propTypes.viewIcon,
      renderer: PropTypes.func.isRequired
    }).isRequired
  ).isRequired
};

export default LayoutRouter;

function mapMenu({ navigate, menu }) {
  return menu && menu.map(({ location, ... item }) => {
    if(!location) {
      return item;
    }

    return {
      onClick: () => navigate(location),
      ... item
    };
  });
}

const defaultRouteMatch = { name: null, icon: null, render: () => null };

class RoutesInfo {
  constructor(routes) {
    this.routesInfo = routes.map(route => new RouteInfo(route));
  }

  findMatch(location) {
    for(const routeInfo of this.routesInfo) {
      const match = routeInfo.match(location);
      if(match) {
        return match;
      }
    }

    return defaultRouteMatch;
  }
}

class RouteInfo {
  constructor(route) {
    this.route = route;
    this.parser = new PathToRegex(route.location);
  }

  match(location) {
    const result = this.parser.match(location);
    if(!result) {
      return null;
    }

    return new RouteMatch(this.route, result);
  }
}

class RouteMatch {
  constructor(route, parameters) {
    this.route = route;
    this.parameters = parameters;
    this.name = this.route.getName ? this.route.getName(parameters) : this.route.name;
    this.icon = this.route.getIcon ? this.route.getIcon(parameters) : this.route.icon;
  }

  render() {
    return this.route.renderer(this.parameters);
  }
}

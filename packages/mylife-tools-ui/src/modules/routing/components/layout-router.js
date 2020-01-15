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
      viewName={routeMatch.renderName()}
      viewIcon={routeMatch.renderIcon()}
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
      nameRenderer: PropTypes.func,
      icon: Layout.propTypes.viewIcon,
      iconRenderer: PropTypes.func,
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

const nullRenderer = () => null;
const defaultRouteMatch = { renderName: nullRenderer, renderIcon: nullRenderer, render: nullRenderer };

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
  }

  renderName() {
    if(this.route.nameRenderer) {
      return this.route.nameRenderer(this.parameters);
    }
    return this.route.name;
  }

  renderIcon() {
    if(this.route.iconRenderer) {
      return this.route.iconRenderer(this.parameters);
    }
    return this.route.icon;
  }

  render() {
    return this.route.renderer(this.parameters);
  }
}

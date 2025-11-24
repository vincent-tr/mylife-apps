import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Layout } from '../../../components/layout';
import { useRoutingConnect } from './behaviors';
import PathToRegex from 'path-to-regex';

const LayoutRouter = ({ routes, menu, appName, appIcon, ...props }) => {
  const { location, navigate } = useRoutingConnect();
  const mappedMenu = mapMenu({ navigate, menu });
  const routesInfo = useMemo(() => new RoutesInfo(routes), [routes]);
  const routeMatch = routesInfo.findMatch(location);

  return (
    <Layout
      onMainClick={() => navigate('/')}
      viewName={routeMatch.renderName()}
      viewIcon={routeMatch.renderIcon()}
      viewAdditionalHeader={routeMatch.renderAdditionalHeader()}
      viewAdditionalBreadcrumb={routeMatch.routerAdditionalBreadcrumb()}
      menu={mappedMenu}
      appName={appName}
      appIcon={appIcon}
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
      additionalHeader: Layout.propTypes.viewAdditionalHeader,
      additionalHeaderRenderer: PropTypes.func,
      additionalBreadcrumb: Layout.propTypes.viewAdditionalBreadcrumb,
      additionalBreadcrumbRenderer: PropTypes.func,
      renderer: PropTypes.func.isRequired
    }).isRequired
  ).isRequired,
  appName: Layout.propTypes.appName,
  appIcon: Layout.propTypes.appIcon,
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
  private readonly routesInfo;
  
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
  private readonly parser;

  constructor(private readonly route) {
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
  constructor(private readonly route, private readonly parameters) {
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

  renderAdditionalHeader() {
    if(this.route.additionalHeaderRenderer) {
      return this.route.additionalHeaderRenderer(this.parameters);
    }
    return this.route.additionalHeader;
  }

  routerAdditionalBreadcrumb() {
    if(this.route.additionalBreadcrumbRenderer) {
      return this.route.additionalBreadcrumbRenderer(this.parameters);
    }
    return this.route.additionalBreadcrumb;
  }

  render() {
    return this.route.renderer(this.parameters);
  }
}

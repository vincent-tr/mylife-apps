import PathToRegex from 'path-to-regex'; // TODO: migrate to path-to-regexp
import React, { useMemo } from 'react';
import { Layout } from '../../../components/layout';
import { useRoutingConnect } from './behaviors';

type FIXME_any = any;

export interface Route {
  location: string;
  name?: string;
  nameRenderer?: (params: FIXME_any) => React.ReactNode;
  icon?: React.ElementType;
  iconRenderer?: (params: FIXME_any) => React.ReactNode;
  additionalHeader?: React.ReactNode;
  additionalHeaderRenderer?: (params: FIXME_any) => React.ReactNode;
  additionalBreadcrumb?: React.ReactNode;
  additionalBreadcrumbRenderer?: (params: FIXME_any) => React.ReactNode;
  renderer: (params: FIXME_any) => React.ReactNode;
}

export interface MenuItem {
  id: string;
  text: React.ReactNode;
  icon?: React.ElementType;
  location?: string;
  onClick?: () => void;
}

export interface LayoutRouterProps
  extends Omit<React.ComponentProps<typeof Layout>, 'onMainClick' | 'viewName' | 'viewIcon' | 'viewAdditionalHeader' | 'viewAdditionalBreadcrumb' | 'menu' | 'children'> {
  routes: Route[];
  menu?: MenuItem[];
}

function LayoutRouter({ routes, menu, ...props }: LayoutRouterProps) {
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
      {...props}
    >
      {routeMatch.render()}
    </Layout>
  );
}

export default LayoutRouter;

function mapMenu({ navigate, menu }) {
  return (
    menu &&
    menu.map(({ location, ...item }) => {
      if (!location) {
        return item;
      }

      return {
        onClick: () => navigate(location),
        ...item,
      };
    })
  );
}

const nullRenderer = () => null;
const defaultRouteMatch = { renderName: nullRenderer, renderIcon: nullRenderer, render: nullRenderer };

class RoutesInfo {
  private readonly routesInfo;

  constructor(routes) {
    this.routesInfo = routes.map((route) => new RouteInfo(route));
  }

  findMatch(location) {
    for (const routeInfo of this.routesInfo) {
      const match = routeInfo.match(location);
      if (match) {
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
    if (!result) {
      return null;
    }

    return new RouteMatch(this.route, result);
  }
}

class RouteMatch {
  constructor(
    private readonly route,
    private readonly parameters
  ) {}

  renderName() {
    if (this.route.nameRenderer) {
      return this.route.nameRenderer(this.parameters);
    }
    return this.route.name;
  }

  renderIcon() {
    if (this.route.iconRenderer) {
      return this.route.iconRenderer(this.parameters);
    }
    return this.route.icon;
  }

  renderAdditionalHeader() {
    if (this.route.additionalHeaderRenderer) {
      return this.route.additionalHeaderRenderer(this.parameters);
    }
    return this.route.additionalHeader;
  }

  routerAdditionalBreadcrumb() {
    if (this.route.additionalBreadcrumbRenderer) {
      return this.route.additionalBreadcrumbRenderer(this.parameters);
    }
    return this.route.additionalBreadcrumb;
  }

  render() {
    return this.route.renderer(this.parameters);
  }
}

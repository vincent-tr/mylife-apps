import { match } from 'path-to-regexp';
import React, { useMemo } from 'react';
import { Layout } from '../../../components/layout';
import { useRoutingConnect } from './behaviors';

type RouteParameters = Record<string, string | string[]>;
type RouteRenderer = (params: RouteParameters) => React.ReactNode;

export interface Route {
  location: string;
  name?: string;
  nameRenderer?: RouteRenderer;
  icon?: React.ElementType;
  iconRenderer?: (params: RouteParameters) => React.ElementType;
  additionalHeader?: React.ReactNode;
  additionalHeaderRenderer?: RouteRenderer;
  additionalBreadcrumb?: React.ReactNode;
  additionalBreadcrumbRenderer?: RouteRenderer;
  renderer: RouteRenderer;
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
  const mappedMenu = mapMenu(navigate, menu);
  const routesInfo = useMemo(() => new RoutesInfo(routes), [routes]);
  const routeMatch = routesInfo.findMatch(location);

  return (
    <Layout
      onMainClick={() => navigate('/')}
      viewName={routeMatch.renderName()}
      viewIcon={routeMatch.renderIcon()}
      viewAdditionalHeader={routeMatch.renderAdditionalHeader()}
      viewAdditionalBreadcrumb={routeMatch.renderAdditionalBreadcrumb()}
      menu={mappedMenu}
      {...props}
    >
      {routeMatch.render()}
    </Layout>
  );
}

export default LayoutRouter;

function mapMenu(navigate: (location: string) => void, menu?: MenuItem[]) {
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

const nullRenderer = <T,>() => null as T;

const defaultRouteMatch: RouteMatch = {
  renderName: nullRenderer,
  renderIcon: nullRenderer,
  renderAdditionalHeader: nullRenderer,
  renderAdditionalBreadcrumb: nullRenderer,
  render: nullRenderer,
};

class RoutesInfo {
  private readonly routesInfo;

  constructor(routes: Route[]) {
    this.routesInfo = routes.map((route) => new RouteInfo(route));
  }

  findMatch(location: string): RouteMatch {
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

  constructor(private readonly route: Route) {
    this.parser = match(route.location);
  }

  match(location: string) {
    const result = this.parser(location);
    if (!result) {
      return null;
    }

    return new RouteMatchImpl(this.route, result.params);
  }
}

interface RouteMatch {
  renderName(): React.ReactNode;
  renderIcon(): React.ElementType;
  renderAdditionalHeader(): React.ReactNode;
  renderAdditionalBreadcrumb(): React.ReactNode;
  render(): React.ReactNode;
}

class RouteMatchImpl implements RouteMatch {
  constructor(
    private readonly route: Route,
    private readonly parameters: RouteParameters
  ) {}

  renderName(): React.ReactNode {
    if (this.route.nameRenderer) {
      return this.route.nameRenderer(this.parameters);
    }
    return this.route.name;
  }

  renderIcon(): React.ElementType {
    if (this.route.iconRenderer) {
      return this.route.iconRenderer(this.parameters);
    }
    return this.route.icon;
  }

  renderAdditionalHeader(): React.ReactNode {
    if (this.route.additionalHeaderRenderer) {
      return this.route.additionalHeaderRenderer(this.parameters);
    }
    return this.route.additionalHeader;
  }

  renderAdditionalBreadcrumb(): React.ReactNode {
    if (this.route.additionalBreadcrumbRenderer) {
      return this.route.additionalBreadcrumbRenderer(this.parameters);
    }
    return this.route.additionalBreadcrumb;
  }

  render(): React.ReactNode {
    return this.route.renderer(this.parameters);
  }
}

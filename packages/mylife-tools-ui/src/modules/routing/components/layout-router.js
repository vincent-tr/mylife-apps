'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { Layout } from '../../../components';
import { useRoutingConnect } from './behaviors';
import RouteView from './route-view';

const defaultRouteData = { name: null, icon: null };

const LayoutRouter = ({ children, menu, ...props }) => {
  const { location, navigate } = useRoutingConnect();

  const mappedMenu = mapMenu({ navigate, menu });
  const routeData = findRouteData(children);
  const currentRoute = routeData.find(route => route.location === location) || defaultRouteData;

  return (
    <Layout
      logoOnClick={() => navigate('/')}
      viewName={currentRoute.name}
      viewIcon={currentRoute.icon}
      menu={mappedMenu}
      {...props}>
      {children}
    </Layout>
  );
};

LayoutRouter.propTypes = {
  children: PropTypes.oneOfType([ PropTypes.arrayOf(PropTypes.node), PropTypes.node ]),
  menu: PropTypes.arrayOf(
    PropTypes.shape({
      id       : PropTypes.string.isRequired,
      text     : PropTypes.node.isRequired,
      icon     : PropTypes.node,
      location : PropTypes.string,
      type     : PropTypes.string.isRequired
    }).isRequired
  )
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

function findRouteData(children) {
  const routeData = [];
  React.Children.forEach(children, (child) => {
    if(!React.isValidElement(child) || child.type !== RouteView) {
      return;
    }

    const { location, name, icon } = child.props;
    routeData.push({ location, name, icon });
  });
  return routeData;
}

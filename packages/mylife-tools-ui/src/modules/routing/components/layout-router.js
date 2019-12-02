'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { Layout } from '../../../components/layout';
import { useRoutingConnect } from './behaviors';

const defaultRouteData = { name: null, icon: null };

const LayoutRouter = ({ routes, menu, ...props }) => {
  const { location, navigate } = useRoutingConnect();

  const mappedMenu = mapMenu({ navigate, menu });
  const currentRoute = routes.find(route => route.location === location) || defaultRouteData;

  return (
    <Layout
      onMainClick={() => navigate('/')}
      viewName={currentRoute.name}
      viewIcon={currentRoute.icon}
      menu={mappedMenu}
      {...props}>
      {currentRoute.renderer()}
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

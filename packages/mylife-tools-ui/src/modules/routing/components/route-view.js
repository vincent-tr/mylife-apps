'use strict';

import PropTypes from 'prop-types';
import { Layout } from '../../../components';
import { useRoutingConnect } from './behaviors';

const RouteView = ({ location, name, icon, children }) => {
  void name, icon; // used in LayoutRouter
  const { location: routingLocation } = useRoutingConnect();
  return location === routingLocation ? children : null;
};

RouteView.propTypes = {
  location: PropTypes.string.isRequired,
  name: Layout.propTypes.viewName,
  icon: Layout.propTypes.viewIcon,
  children: Layout.propTypes.children
};

export default RouteView;

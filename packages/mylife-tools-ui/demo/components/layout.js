'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { components } from 'mylife-tools-ui';
import icon from '../icon.ico';
import { setView } from '../actions/view';

const Layout = ({ viewName, viewIcon, children, menuClick, logoClick }) => (
  <components.Layout logoName={<h1>Demo</h1>}
    logoIcon={<components.Icon src={icon}/>}
    logoOnClick={logoClick}
    viewName={<h2>{viewName}</h2>}
    viewIcon={<components.Icon src={viewIcon}/>}
    menu={[
      { id: 'header1', text: 'Header 1', icon: null, type: 'header' },
      { id: 'item11', text: 'Item 1.1', icon: <components.Icon src={icon}/>, type: 'item', onClick: menuClick },
      { id: 'item12', text: 'Item 1.2', icon: <components.Icon src={icon}/>, type: 'item', onClick: menuClick },
      { id: 'header2', text: 'Header 2', icon: <components.Icon src={icon}/>, type: 'header', onClick: menuClick },
      { id: 'item21', text: 'Item 2.1', icon: null, type: 'item', onClick: menuClick },
      { id: 'item22', text: 'Item 2.2', icon: null, type: 'item', onClick: menuClick },
    ]}
    footer={'footer'}>
    {children}
  </components.Layout>
);

Layout.propTypes = {
  viewName: PropTypes.string.isRequired,
  viewIcon: PropTypes.string.isRequired,
  children: components.Layout.propTypes.children,
  menuClick: PropTypes.func.isRequired,
  logoClick: PropTypes.func.isRequired
};

const mapStateToProps = () => ({
});

const mapDispatchToProps = (dispatch) => ({
  menuClick : id => dispatch(setView(id)),
  logoClick : () => dispatch(setView('default'))
});

export default connect(mapStateToProps, mapDispatchToProps)(Layout);

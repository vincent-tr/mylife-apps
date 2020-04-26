'use strict';

import { React, PropTypes, mui, useMemo, routing } from 'mylife-tools-ui';

const Breadcrumb = ({ path }) => {
  const { navigate } = routing.useRoutingConnect();
  const nodes = useMemo(() => path.split('/'), [path]);
  
  const createNavigate = (path) => {
    return e => {
      e.preventDefault();
      navigate(`/${path}`);
    };
  };

  return (
    <mui.Breadcrumbs>
        <mui.Link color='inherit' href='/' onClick={createNavigate('')}>
          {'<Racine>'}
        </mui.Link>

      {nodes.map((node, index) => (
        <mui.Link key={`${index}-${node}`} color='inherit' href='/' onClick={createNavigate(makePath(nodes, index))}>
          {node}
        </mui.Link>
      ))}
    </mui.Breadcrumbs>
  );
};

Breadcrumb.propTypes = {
  path: PropTypes.string.isRequired,
};

export default Breadcrumb;

function makePath(nodes, index) {
  return nodes.slice(0, index + 1);
}


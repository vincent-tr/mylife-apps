'use strict';

import { React, PropTypes, mui, useMemo, routing } from 'mylife-tools-ui';

const Breadcrumb = ({ path }) => {
  const { navigate } = routing.useRoutingConnect();
  const nodes = useMemo(() => path.split('/'), [path]);
  
  return (
    <mui.Breadcrumbs>
      {nodes.map((node, index) => {
        const clickHandler = e => {
          e.preventDefault();
          navigate(makeTarget(nodes, index));
        };

        return (
          <mui.Link key={`${index}-${node}`} color='inherit' href='/' onClick={clickHandler}>
            {node}
          </mui.Link>
        );
      })}
    </mui.Breadcrumbs>
  );
};

Breadcrumb.propTypes = {
  path: PropTypes.string.isRequired,
};

export default Breadcrumb;

function makeTarget(nodes, index) {
  const path = nodes.slice(0, index + 1);
  return `/${path}`;
}
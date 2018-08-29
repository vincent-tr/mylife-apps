'use strict';

import React                from 'react';
import PropTypes            from 'prop-types';
import { Breadcrumb }       from 'semantic-ui-react';
import { connect }          from 'react-redux';
import { getMetadataNodes } from '../selectors/metadata';
import { navigate }         from '../actions/navigation';

const Navigation = ({ nodes, navigate }) => {
  const isRoot = !nodes.length;
  const rootHandler = isRoot ? null : () => navigate('/');
  return (
    <Breadcrumb>
      <Breadcrumb.Section active={isRoot} link={!isRoot} onClick={rootHandler}>Racine</Breadcrumb.Section>
      <Breadcrumb.Divider />

      {nodes.map((node, index) => {
        const isLast = index === nodes.length -1;

        if(isLast) {
          return (
            <Breadcrumb.Section key={index} active>{node}</Breadcrumb.Section>
          );
        }

        const path = '/' + nodes.slice(0, index + 1).join('/');
        const handler = () => navigate(path);

        return (
          <React.Fragment key={index}>
            <Breadcrumb.Section link onClick={handler}>{node}</Breadcrumb.Section>
            <Breadcrumb.Divider />
          </React.Fragment>
        );
      })}
    </Breadcrumb>
  );
};

Navigation.propTypes = {
  nodes    : PropTypes.array.isRequired,
  navigate : PropTypes.func.isRequired,
};

const mapStateToProps = () => {
  return (state) => ({
    nodes : getMetadataNodes(state) || []
  });
};

const mapDispatchToProps = (dispatch) => ({
  navigate : path => dispatch(navigate(path)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navigation);

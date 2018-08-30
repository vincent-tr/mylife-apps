'use strict';

import React                  from 'react';
import PropTypes              from 'prop-types';
import { connect }            from 'react-redux';
import { List } from 'semantic-ui-react';
import { getMetadataContent, getMetadataPath } from '../../selectors/metadata';
import { navigate }         from '../../actions/navigation';

const Directory = ({ path, content, navigate }) => (
  <List>
    {content.map(({ name }) => (
      <List.Item key={name} onClick={() => navigate(formatPath(path, name))}>{name}</List.Item>
    ))}
  </List>
);

Directory.propTypes = {
  path     : PropTypes.string,
  content  : PropTypes.array.isRequired,
  navigate : PropTypes.func.isRequired,
};

const mapStateToProps = () => {
  return (state) => ({
    path    : getMetadataPath(state),
    content : getMetadataContent(state) || []
  });
};

const mapDispatchToProps = (dispatch) => ({
  navigate : path => dispatch(navigate(path)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Directory);

function formatPath(... parts) {
  const nodes = [];
  for(const part of parts) {
    nodes.push(...part.split('/').filter(n => n));
  }
  return '/' + nodes.join('/');
}
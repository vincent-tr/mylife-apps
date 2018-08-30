'use strict';

import React              from 'react';
import PropTypes          from 'prop-types';
import { List, Icon, Header }       from 'semantic-ui-react';
import { connect }          from 'react-redux';
import { getMetadataInfos } from '../selectors/metadata';
import { formatSize, formatDate } from './utils';
import { getTypeInfo }            from './types';

const Infos = ({ data }) => (
  <List>
    <List.Item>
      <Header as='h3'>
        <Icon size='big' name={getTypeInfo(data).icon} />
        {data.name || 'Racine'}
      </Header>
    </List.Item>

    <List.Item>
      <List.Header>Taille</List.Header>
      {formatSize(data.size)}
    </List.Item>

    <List.Item>
      <List.Header>Créé</List.Header>
      {formatDate(data.birthtime)}
    </List.Item>

    <List.Item>
      <List.Header>Modifié</List.Header>
      {formatDate(data.mtime)}
    </List.Item>

    <List.Item>
      <List.Header>Accédé</List.Header>
      {formatDate(data.atime)}
    </List.Item>
  </List>
);

Infos.propTypes = {
  data : PropTypes.object.isRequired
};

const mapStateToProps = () => {
  return (state) => ({
    data : getMetadataInfos(state) || {}
  });
};

export default connect(
  mapStateToProps,
  null
)(Infos);

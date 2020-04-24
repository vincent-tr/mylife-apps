'use strict';

import React                                   from 'react';
import PropTypes                               from 'prop-types';
import { connect }                             from 'react-redux';
import { Icon, Table }                         from 'semantic-ui-react';
import { getMetadataContent, getMetadataPath } from '../../selectors/metadata';
import { getTypeInfo }                         from './';
import { navigate }                            from '../../actions/navigation';
import { formatSize, formatDate, formatPath }  from '../utils';

const styles = {
  table : {
    display     : 'flex',
    flexFlow    : 'column',
    height      : '100%',
    width       : '100%',
  },
  header : {
    flex        : '0 0 auto',
    width       : 'calc(100% - 10px)', // see ::-webkit-scrollbar in semantic.css
    display     : 'block',
  },
  body : {
    flex        : '1 1 auto',
    display     : 'block',
    overflowY   : 'scroll',
    height      : 0, // seems that we need this on firefox
  },
  row : {
    width       : '100%',
    display     : 'table',
    tableLayout : 'fixed',
  }
};

const Directory = ({ path, content, navigate }) => (
  <Table selectable style={styles.table}>
    <Table.Header style={styles.header}>
      <Table.Row style={styles.row}>
        <Table.HeaderCell>Nom</Table.HeaderCell>
        <Table.HeaderCell>Date modification</Table.HeaderCell>
        <Table.HeaderCell>Taille</Table.HeaderCell>
      </Table.Row>
    </Table.Header>

    <Table.Body style={styles.body}>
      {content.map(({ name, mtime, size, type, mime }) => (
        <Table.Row key={name} onClick={() => navigate(formatPath(path, name))} style={styles.row}>
          <Table.Cell><Icon name={getTypeInfo({ type, mime }).icon} /> {name}</Table.Cell>
          <Table.Cell>{formatDate(mtime)}</Table.Cell>
          <Table.Cell>{formatSize(size)}</Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  </Table>
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

'use strict';

import { connect } from 'react-redux';
import { managementSelectGroup, createGroup, deleteGroup } from '../../actions/index';

import Index from '../../components/management/index';

const mapStateToProps = (/*state*/) => ({
});

const mapDispatchToProps = (dispatch) => ({
  onGroupCreate   : () => dispatch(createGroup()),
  onGroupEdit     : () => {},
  onGroupDelete   : (id) => dispatch(deleteGroup(id))
});

const IndexContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Index);

export default IndexContainer;

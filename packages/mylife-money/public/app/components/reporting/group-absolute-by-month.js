'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import * as mui from 'material-ui';
import icons from '../icons';

import AccountSelectorContainer from '../../containers/common/account-selector-container';
import GroupSelectorContainer from '../../containers/common/group-selector-container';

const styles = {
  button: {
    height: 56,
    width: 56,
    overflow: 'inherit'
  },
  date: {
    width: 100
  }
};

class GroupAbsoluteByMonth extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      minDate : null,
      maxDate : null,
      account : null,
      groups  : [ null ],
      data    : null
    };
  }

  changeCriteria(newValues) {
    this.setState(newValues);

    const { onRefreshOperations } = this.props;
    const criteria = { ...this.state, ...newValues };
    const { minDate, maxDate, account } = criteria;

    onRefreshOperations(minDate, maxDate, account);
  }

  addGroup() {
    this.setState({ groups: [ ...this.state.groups, null ] });
    this.refreshData();
  }

  deleteGroup(index) {
    this.setState({ groups: [ ...this.state.groups.slice(0, index), ...this.state.groups.slice(index + 1) ] });
    this.refreshData();
  }

  changeGroup(index, value) {
    this.setState({ groups: [ ...this.state.groups.slice(0, index), value, ...this.state.groups.slice(index + 1) ] });
    this.refreshData();
  }

  componentWillReceiveProps(nextProps) {
    const { operations } = nextProps;
    if(this.props.operations === operations) { return; }
    this.refreshData(operations);
  }

  refreshData(operations = this.props.operations) {
    // TODO: transform
    const data = operations;
    this.setState({ data });
  }

  renderGroups() {
    const { groups } = this.state;

    const onGroupChanged   = (index, value) => this.changeGroup(index, value);
    const onGroupDelete    = (index) => this.deleteGroup(index);

    const arrays = groups.map((group, index) => [
      <mui.ToolbarSeparator key={`${index}-1`}/>,
      <GroupSelectorContainer key={`${index}-2`} value={group} onChange={(value) => onGroupChanged(index, value)} />,
      <mui.IconButton key={`${index}-3`} tooltip="Supprimer le groupe"
                      onClick={() => onGroupDelete(index)}
                      style={styles.button}>
        <icons.actions.Delete />,
      </mui.IconButton>
    ]);
    return [].concat(...arrays);
  }

  render() {
    const { minDate, maxDate, account } = this.state;

    const onMinDateChanged = (value) => this.changeCriteria({ minDate: value });
    const onMaxDateChanged = (value) => this.changeCriteria({ maxDate: value });
    const onAccountChanged = (value) => this.changeCriteria({ account: value });
    const onGroupAdd       = () => this.addGroup();

    return (
      <mui.Toolbar>
        <mui.ToolbarGroup>
          <p>Date début</p>
          <mui.IconButton tooltip="Pas de date de début"
                          onClick={() => onMinDateChanged(null)}
                          style={styles.button}>
            <icons.actions.Delete />
          </mui.IconButton>
          <mui.DatePicker id="minDate" value={minDate} onChange={(event, date) => onMinDateChanged(date)} textFieldStyle={styles.date} />
        </mui.ToolbarGroup>

        <mui.ToolbarGroup>
          <p>Date fin</p>
          <mui.IconButton tooltip="Pas de date de fin"
                          onClick={() => onMaxDateChanged(null)}
                          style={styles.button}>
            <icons.actions.Delete />
          </mui.IconButton>
          <mui.DatePicker id="maxDate" value={maxDate} onChange={(event, date) => onMaxDateChanged(date)} textFieldStyle={styles.date} />
        </mui.ToolbarGroup>

        <mui.ToolbarGroup>
          <p>Compte</p>
          <AccountSelectorContainer allowNull={true} value={account} onChange={onAccountChanged} width={200} />
        </mui.ToolbarGroup>

        <mui.ToolbarGroup>
          <p>Groupes</p>
          <mui.IconButton tooltip="Ajouter un groupe"
                          onClick={() => onGroupAdd()}
                          style={styles.button}>
            <icons.actions.New />
          </mui.IconButton>
          {this.renderGroups()}
        </mui.ToolbarGroup>
      </mui.Toolbar>
    );
  }
}

GroupAbsoluteByMonth.propTypes = {
  operations          : PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  onRefreshOperations : PropTypes.func.isRequired
};

export default GroupAbsoluteByMonth;
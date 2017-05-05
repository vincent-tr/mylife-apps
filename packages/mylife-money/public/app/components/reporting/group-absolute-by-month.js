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

function leftPad(number, targetLength) {
  let output = number + '';
  while (output.length < targetLength) {
    output = '0' + output;
  }
  return output;
}

class GroupAbsoluteByMonth extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      minDate : null,
      maxDate : null,
      account : null,
      groups  : [ null ],
      data    : [],
      dates   : []
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
    const { operations: newOperations } = nextProps;
    const { operations: oldOperations } = this.props;

    if(newOperations !== oldOperations) {
      this.refreshData(newOperations);
    }
  }

  refreshData(operations = this.props.operations) {
    const { groups } = this.state;
    const { groupBags } = this.props;
    const map = new Map();
    const dateSet = new Set();

    for(const operation of operations) {
      for(const group of groups) {
        const bag = groupBags.get(group);
        if(!bag.has(operation.group || null)) {
          continue;
        }

        const opdate = new Date(operation.date);
        const date = `${opdate.getFullYear()}-${leftPad(opdate.getMonth() + 1, 2)}`;
        const key = `${group}-${date}`;

        dateSet.add(date);

        let item = map.get(key);
        if(!item) {
          map.set(key, (item = { group, date, value: 0 }));
        }
        item.value += operation.amount;
      }
    }

    const data = Array.from(map.values());
    const dates = Array.from(dateSet);
    dates.sort();

    this.setState({ data, dates });
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

  renderToolbar() {
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

  renderReport() {
    const { groupStacks, groupBags } = this.props;
    const { groups, dates, data } = this.state;

    const series = groups.map(group => ({ field: group, name: groupStacks.get(group).map(group => group.display).join('/') }));

console.log(series, dates, data);

    return null;

  }

  render() {
    return (
      <div>
        {this.renderToolbar()}
        {this.renderReport()}
      </div>
    );
  }
}

GroupAbsoluteByMonth.propTypes = {
  groups              : PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  groupBags           : PropTypes.object.isRequired,
  groupStacks         : PropTypes.object.isRequired,
  operations          : PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  onRefreshOperations : PropTypes.func.isRequired
};

export default GroupAbsoluteByMonth;
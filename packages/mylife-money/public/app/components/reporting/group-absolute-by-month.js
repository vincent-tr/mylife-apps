'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import * as mui from 'material-ui';
import base from '../base/index';
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
      group   : null
    };
  }

  changeCriteria(newValues) {
    this.setState(newValues);

    const { onRefreshOperations } = this.props;
    const criteria = { ...this.state, ...newValues };
    const { minDate, maxDate, account } = criteria;
    onRefreshOperations(minDate, maxDate, account);
  }

  render() {
    const { minDate, maxDate, account, group } = this.state;
    const onMinDateChanged = (value) => this.changeCriteria({ minDate: value });
    const onMaxDateChanged = (value) => this.changeCriteria({ maxDate: value });
    const onAccountChanged = (value) => this.changeCriteria({ account: value });
    const onGroupChanged   = (value) => this.changeCriteria({ group: value });

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
          <p>Groupe</p>
          <GroupSelectorContainer value={group} onChange={onGroupChanged} />
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
'use strict';

import { React, useState, useMemo, PropTypes, useDispatch, useSelector } from 'mylife-tools-ui';
import { getOperations } from '../../../selectors/reporting';
import { getGroups, makeGetGroupBags } from '../../../selectors/groups';
import { refreshOperations } from '../../../actions/reporting';

import Toolbar from './toolbar';
import Chart from './chart';

const useConnect = () => {
  const dispatch = useDispatch();
  const getGroupBags = useMemo(makeGetGroupBags, []);
  return {
    ...useSelector(state => ({
      operations  : getOperations(state),
      groups      : getGroups(state),
      groupBags   : getGroupBags(state)
    })),
    ...useMemo(() => ({
      onRefreshOperations : (minDate, maxDate, account) => dispatch(refreshOperations(minDate, maxDate, account))
    }), [dispatch])
  };
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
      data : [],
      criteria: {}
    };
  }

  changeCriteria(criteria) {
    this.setState({ criteria });

    const { onRefreshOperations } = this.props;
    const { minDate, maxDate, account } = criteria;

    onRefreshOperations(minDate, maxDate, account);
  }

  componentWillReceiveProps(nextProps) {
    const { operations: newOperations } = nextProps;
    const { operations: oldOperations } = this.props;

    if(newOperations !== oldOperations) {
      this.refreshData(newOperations);
    }
  }

  refreshData(operations) {
    const { criteria } = this.state;
    const { groups, reverse } = criteria;
    const { groupBags } = this.props;
    const map = new Map();

    for(const operation of operations) {
      for(const group of groups) {
        const bag = groupBags.get(group);
        if(!bag.has(operation.group || null)) {
          continue;
        }

        const opdate = new Date(operation.date);
        const date = `${opdate.getFullYear()}-${leftPad(opdate.getMonth() + 1, 2)}`;

        let item = map.get(date);
        if(!item) {
          item = { date , groups: new Map() };
          for(const group of groups) {
            item.groups.set(group, { value: 0 });
          }
          map.set(date, item);
        }
        item.groups.get(group).value += (reverse ? -operation.amount : operation.amount);
      }
    }

    const data = Array.from(map.values()).map(item => {
      const ret = { date: item.date };
      for(const [group, val] of item.groups.entries()) {
        ret[`group-${group}`] = Math.round(val.value * 100) / 100;
      }
      return ret;
    });

    data.sort((item1, item2) => item1.date < item2.date ? -1 : 1);

    this.setState({ data });
  }

  render() {
    const { criteria, data } = this.state;
    const { groups } = criteria;

    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Toolbar onCriteriaChanged={(criteria) => this.changeCriteria(criteria)} />
        <Chart data={data} groups={groups} style={{ flex: '0 0 auto'}} />
      </div>
    );
  }
}

GroupAbsoluteByMonth.propTypes = {
  groups              : PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  groupBags           : PropTypes.object.isRequired,
  operations          : PropTypes.arrayOf(PropTypes.object.isRequired).isRequired,
  onRefreshOperations : PropTypes.func.isRequired
};

const GroupAbsoluteByMonthWrapper = () => (<GroupAbsoluteByMonth {...useConnect()} />);

export default GroupAbsoluteByMonthWrapper;

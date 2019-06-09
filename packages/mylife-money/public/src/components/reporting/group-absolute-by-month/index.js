'use strict';

import { React, useState, useMemo, PropTypes, mui,  chart, ToolbarFieldTitle, ToolbarSeparator, useDispatch, useSelector } from 'mylife-tools-ui';
import tabStyles from '../../base/tab-styles';
import { getOperations } from '../../../selectors/reporting';
import { getGroups, makeGetGroupBags, makeGetGroupStacks } from '../../../selectors/groups';
import { refreshOperations } from '../../../actions/reporting';

import Toolbar from './toolbar';

const useConnect = () => {
  const dispatch = useDispatch();
  const getGroupBags = useMemo(makeGetGroupBags, []);
  const getGroupStacks = useMemo(makeGetGroupStacks, []);
  return {
    ...useSelector(state => ({
      operations  : getOperations(state),
      groups      : getGroups(state),
      groupBags   : getGroupBags(state),
      groupStacks : getGroupStacks(state),
    })),
    ...useMemo(() => ({
      onRefreshOperations : (minDate, maxDate, account) => dispatch(refreshOperations(minDate, maxDate, account))
    }), [dispatch])
  };
};

const styles = {
  button: {
    height: 56,
    width: 56,
    overflow: 'inherit'
  },
  chartWrapper: {
    height: 'calc(100% - 60px)'
  }
};

function leftPad(number, targetLength) {
  let output = number + '';
  while (output.length < targetLength) {
    output = '0' + output;
  }
  return output;
}

const Chart = ({ data, groups, groupStacks }) => {

  // http://materialuicolors.co/
  const colors = [
    '#EF9A9A', '#90CAF9', '#C5E1A5', '#FFAB91',
    '#F48FB1', '#81D4FA', '#E6EE9C', '#BCAAA4'
  ];

  if(!data.length) { return null; }

  const series = groups.map((group, index) => ({
    index,
    group,
    display : groupStacks.get(group).map(group => group.display).join('/'),
    fill    : colors[index % colors.length]
  }));

  return (
    <div style={styles.chartWrapper}>
      <chart.ResponsiveContainer>
        <chart.BarChart data={data} margin={{top: 20, right: 20, left: 20, bottom: 20}}>
          <chart.XAxis dataKey="date" name="Date" />
          <chart.YAxis name="Montant" />
          <chart.CartesianGrid strokeDasharray="3 3"/>
          <chart.Tooltip/>
          <chart.Legend />
          {series.map(serie => (<chart.Bar key={serie.index} dataKey={`group-${serie.group}`} name={serie.display} fill={serie.fill} />))}
        </chart.BarChart>
      </chart.ResponsiveContainer>
    </div>
  );
};

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
    const { groupStacks } = this.props;

    return (
      <div style={tabStyles.fullHeight}>
        <Toolbar onCriteriaChanged={(criteria) => this.changeCriteria(criteria)} />
        <Chart data={data} groups={groups} groupStacks={groupStacks} />
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

const GroupAbsoluteByMonthWrapper = () => (<GroupAbsoluteByMonth {...useConnect()} />);

export default GroupAbsoluteByMonthWrapper;

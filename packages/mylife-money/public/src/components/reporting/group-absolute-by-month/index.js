'use strict';

import { React, useState, useMemo, useEffect, mui, useDispatch, useSelector } from 'mylife-tools-ui';
import { getOperations } from '../../../selectors/reporting';
import { getGroupBags } from '../../../selectors/reference';
import { refreshOperations } from '../../../actions/reporting';

import Toolbar from './toolbar';
import Chart from './chart';

const useConnect = () => {
  const dispatch = useDispatch();
  return {
    ...useSelector(state => ({
      operations  : getOperations(state),
      groupBags   : getGroupBags(state)
    })),
    ...useMemo(() => ({
      onRefreshOperations : (minDate, maxDate, account) => dispatch(refreshOperations(minDate, maxDate, account))
    }), [dispatch])
  };
};

const useStyles = mui.makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 auto'
  },
  chart: {
    flex: '1 1 auto'
  }
});

const GroupAbsoluteByMonth = () => {
  const [criteria, setCriteria] = useState({ reverse: true, minDate: null, maxDate: null, account: null, groups: [ null ] });
  const { operations, groupBags, onRefreshOperations } = useConnect();
  const data = useMemo(() => refreshData(groupBags, operations, criteria), [groupBags, operations, criteria]);
  const classes = useStyles();

  const changeCriteria = (criteria) => {
    setCriteria(criteria);
    const { minDate, maxDate, account } = criteria;
    onRefreshOperations(minDate, maxDate, account);
  };

  // on mount run query
  useEffect(() => {
    const { minDate, maxDate, account } = criteria;
    onRefreshOperations(minDate, maxDate, account);
  }, []);

  const { groups } = criteria;

  return (
    <div className={classes.container}>
      <Toolbar onCriteriaChanged={changeCriteria} />
      <Chart data={data} groups={groups} className={classes.chart} />
    </div>
  );
};

export default GroupAbsoluteByMonth;

// TODO: move server side
function refreshData(groupBags, operations, criteria) {
  if(!groupBags || !operations || !criteria) {
    return [];
  }

  const { groups, reverse } = criteria;
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

  return data;
}

function leftPad(number, targetLength) {
  let output = number + '';
  while (output.length < targetLength) {
    output = '0' + output;
  }
  return output;
}

'use strict';

import { React, useMemo, PropTypes, mui,  chart, ToolbarFieldTitle, ToolbarSeparator, useDispatch, useSelector } from 'mylife-tools-ui';
import icons from '../icons';
import tabStyles from '../base/tab-styles';
import { getOperations } from '../../selectors/reporting';
import { getGroups, makeGetGroupBags, makeGetGroupStacks } from '../../selectors/groups';
import { refreshOperations } from '../../actions/reporting';

import AccountSelector from '../common/account-selector';
import GroupSelector from '../common/group-selector';

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

class GroupAbsoluteByMonth extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      reverse : true,
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
    const groups = [ ...this.state.groups, null ];
    this.setState({ groups });
    this.refreshData(null, { groups });
  }

  deleteGroup(index) {
    const groups = [ ...this.state.groups.slice(0, index), ...this.state.groups.slice(index + 1) ];
    this.setState({ groups });
    this.refreshData(null, { groups });
  }

  changeGroup(index, value) {
    const groups = [ ...this.state.groups.slice(0, index), value, ...this.state.groups.slice(index + 1) ];
    this.setState({ groups });
    this.refreshData(null, { groups });
  }

  setReverse(value) {
    this.setState({ reverse: value });
    this.refreshData(null, { reverse: value });
  }

  componentWillReceiveProps(nextProps) {
    const { operations: newOperations } = nextProps;
    const { operations: oldOperations } = this.props;

    if(newOperations !== oldOperations) {
      this.refreshData(newOperations);
    }
  }

  refreshData(operations, newState) {
    operations = operations || this.props.operations;
    newState = { ...this.state, ...newState };
    const { groups, reverse } = newState;
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

  renderGroups() {
    const { groups } = this.state;

    const onGroupChanged   = (index, value) => this.changeGroup(index, value);
    const onGroupDelete    = (index) => this.deleteGroup(index);

    const arrays = groups.map((group, index) => [
      <ToolbarSeparator key={`${index}-1`}/>,
      <GroupSelector key={`${index}-2`} value={group} onChange={(value) => onGroupChanged(index, value)} />,
      <mui.IconButton key={`${index}-3`} tooltip="Supprimer le groupe"
                      onClick={() => onGroupDelete(index)}
                      style={styles.button}>
        <icons.actions.Delete />
      </mui.IconButton>
    ]);
    return [].concat(...arrays);
  }

  renderToolbar() {
    const { reverse, minDate, maxDate, account } = this.state;

    const onReverseChanged = (value) => this.setReverse(value);
    const onMinDateChanged = (value) => this.changeCriteria({ minDate: value });
    const onMaxDateChanged = (value) => this.changeCriteria({ maxDate: value });
    const onAccountChanged = (value) => this.changeCriteria({ account: value });
    const onGroupAdd       = () => this.addGroup();

    return (
      <mui.Toolbar>
        <ToolbarFieldTitle>Inverser montant</ToolbarFieldTitle>
        <mui.Checkbox checked={reverse}
                      onChange={e => onReverseChanged(e.target.checked)} />

        <ToolbarSeparator />

        <ToolbarFieldTitle>Date début</ToolbarFieldTitle>
        <mui.DatePicker value={minDate} onChange={onMinDateChanged} clearable autoOk format='DD/MM/YYYY' />

        <ToolbarSeparator />

        <ToolbarFieldTitle>Date fin</ToolbarFieldTitle>
        <mui.DatePicker value={maxDate} onChange={onMaxDateChanged} clearable autoOk format='DD/MM/YYYY' />

        <ToolbarSeparator />

        <ToolbarFieldTitle>Compte</ToolbarFieldTitle>
        <AccountSelector allowNull={true} value={account} onChange={onAccountChanged} width={200} />

        <ToolbarSeparator />

        <ToolbarFieldTitle>Groupes</ToolbarFieldTitle>
        <mui.IconButton tooltip="Ajouter un groupe"
                        onClick={() => onGroupAdd()}
                        style={styles.button}>
          <icons.actions.New />
        </mui.IconButton>
        {this.renderGroups()}
      </mui.Toolbar>
    );
  }

  renderReport() {
    const { groupStacks } = this.props;
    const { groups, data } = this.state;

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
  }

  render() {
    return (
      <div style={tabStyles.fullHeight}>
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

const GroupAbsoluteByMonthWrapper = () => (<GroupAbsoluteByMonth {...useConnect()} />);

export default GroupAbsoluteByMonthWrapper;

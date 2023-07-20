import { React, mui, useActions, useLifecycle, immutable, useReducer, useEffect } from 'mylife-tools-ui';
import { StatsType, fetchValues, enter, leave } from '../actions';
import CriteriaSelector, { Criteria } from './criteria-selector';
import Chart from './chart';

const useStyles = mui.makeStyles(theme => ({
  container: {
    flex: '1 1 auto',
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
  },
  criteria: {
  },
  chart: {
    flex: '1 1 auto',
  }
}));

const Stats: React.FunctionComponent = () => {
  useViewLifecycle();
  const classes = useStyles();
  const actions = useActions({ fetchValues });

  const [criteria, onCriteriaChange] = useReducer(
    (criteria: Criteria, props: Partial<Criteria>) => ({ ... criteria, ...props }), 
    { type: StatsType.Day, date: new Date(), devices: immutable.Set<string>() } as Criteria
  );

  useEffect(() => {
    actions.fetchValues(criteria.type, criteria.date, criteria.devices.toArray());
  }, [criteria]);

  return (
    <div className={classes.container}>
      <CriteriaSelector className={classes.criteria} criteria={criteria} onChange={onCriteriaChange} />
      <Chart className={classes.chart} type={criteria.type} />
    </div>
  );
};

export default Stats;

function useViewLifecycle() {
  const actions = useActions({ enter, leave });
  useLifecycle(actions.enter, actions.leave);
}

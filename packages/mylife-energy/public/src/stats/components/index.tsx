import { React, mui, useLifecycle, useActions } from 'mylife-tools-ui';
import { StatsType, getValues } from '../actions';

const Stats: React.FunctionComponent = () => {
  const actions = useActions({ getValues });

  return (
    <div>
      STATS
      <mui.Button onClick={() => actions.getValues(StatsType.Day, new Date(2023, 6, 17), ['epanel-baie-brassage'])}>Compute</mui.Button>
    </div>
  );
};

export default Stats;

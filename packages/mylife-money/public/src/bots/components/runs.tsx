import { React, mui, useSelector, useCallback, useAction, useActions, useLifecycle, fireAsync } from 'mylife-tools-ui';
import icons from '../../common/icons';
import { getViewList } from '../selectors';
import { startBot, fetchRuns, clearRuns } from '../actions';

const Runs: React.FunctionComponent<{ id: string }> = ({ id }) => {
  const runs = useRuns(id);
  const start = useStart(id);

  return (
    <>
      <mui.Tooltip title='Lancer le robot'>
        <mui.IconButton onClick={start}>
          <icons.actions.Execute />
        </mui.IconButton>
      </mui.Tooltip>

      Runs
      Logs
      {JSON.stringify(runs)}
    </>
  );
};

export default Runs;

function useRuns(id: string) {
  const actions = useActions({ fetchRuns, clearRuns });
  useLifecycle(() => actions.fetchRuns(id), actions.clearRuns, [id]);

  return useSelector(getViewList);
}


function useStart(id: string) {
  const start = useAction(startBot);
  return useCallback(() => fireAsync(async () => start(id)), [id, start, fireAsync]);
}
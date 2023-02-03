import { React, mui, clsx, CriteriaField, DeleteButton, useSelector, useCallback, useAction, useActions, useLifecycle, fireAsync, useEffect, useState, ListContainer } from 'mylife-tools-ui';
import icons from '../../common/icons';
import { getViewList } from '../selectors';
import { startBot, clearBotState, fetchRuns, clearRuns } from '../actions';

type FIXME_any = any;
type Bot = FIXME_any;

const useStyles = mui.makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  gridContainer: {
    padding: theme.spacing(1),
  },
  splitContainer: {
    display: 'flex',
    flexDirection: 'row',
    flex: '1 1 auto',
  },
  list: {
  },
  content: {
    flex: '1 1 auto',
    overflowY: 'auto',
    padding: theme.spacing(1),
  }
}));

const Runs: React.FunctionComponent<{ bot: Bot; className?: string }> = ({ bot, className }) => {
  const classes = useStyles();
  const runs = useRuns(bot._id);
  const start = useStart(bot._id);
  const clearState = useClearState(bot._id);
  const [selection, setSelection] = useState<string>(null);

  useEffect(() => {
    setSelection(null);
  }, [bot._id]);

  return (
    <div className={clsx(classes.container, className)}>
      <div className={classes.gridContainer}>
        <mui.Grid container spacing={2}>
          <mui.Grid item xs={6}>
            <CriteriaField label={'Lancer le robot'}>
              <mui.IconButton onClick={start}>
                <icons.actions.Execute />
              </mui.IconButton>
            </CriteriaField>
          </mui.Grid>

          <mui.Grid item xs={6}>
            <CriteriaField label={`Supprimer l'état`}>
              <DeleteButton icon onConfirmed={clearState} disabled={bot.state == null} />
            </CriteriaField>
          </mui.Grid>
        </mui.Grid>
      </div>

      <mui.Divider />

      <div className={classes.splitContainer}>
        <ListContainer className={classes.list}>
          <mui.List>
            {runs.map(run => (
              <mui.ListItem key={run._id} selected={selection === run._id} button onClick={() => setSelection(run._id)}>
                <mui.ListItemText primary={run.start.toLocaleString('fr-fr')} />
              </mui.ListItem>
            ))}
          </mui.List>
        </ListContainer>

        <mui.Divider orientation='vertical' />

        <div className={classes.content}>
          Run details
          Run Logs
        </div>
      </div>
    </div>
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

function useClearState(id: string) {
  const clearState = useAction(clearBotState);
  return useCallback(() => fireAsync(async () => clearState(id)), [id, clearState, fireAsync]);
}

import { React, mui, DeleteButton, CriteriaField, useAction, fireAsync, useCallback } from 'mylife-tools-ui';
import { NoopConfig, NoopState } from './config/noop';
import { CicScraperConfig, CicScraperState } from './config/cic-scraper';
import { clearBotState } from '../actions';

type FIXME_any = any;
type Bot = FIXME_any;

const Detail: React.FunctionComponent<{ bot: Bot }> = ({ bot }) => {
  const Config = getConfigComponent(bot.type);
  const State = getStateComponent(bot.type);
  const clearState = useClearState(bot._id);

  return (
    <mui.Grid container spacing={2}>
      <mui.Grid item xs={6}>
        <CriteriaField label={
          <>
            {'Planification '}
            <mui.Link href="https://github.com/node-cron/node-cron#cron-syntax" target="_blank" rel="noopener">
              "cron"
            </mui.Link>
          </>
        }>
          <mui.TextField InputProps={{ readOnly: true }} value={bot.schedule} />
        </CriteriaField>
      </mui.Grid>

      <mui.Grid item xs={6}>
        <CriteriaField label={`Supprimer l'état`}>
          <DeleteButton icon onConfirmed={clearState} disabled={bot.state == null} />
        </CriteriaField>
      </mui.Grid>

      <Config configuration={bot.configuration} />
      <State state={bot.state} />
    </mui.Grid>
  );
};

export default Detail;

function getConfigComponent(type: 'noop' | 'cic-scraper') {
  switch(type) {
    case 'noop':
      return NoopConfig;
    case 'cic-scraper':
      return CicScraperConfig;
    default:
      throw new Error(`Unknown bot type '${type}'`);
  }
}

function getStateComponent(type: 'noop' | 'cic-scraper') {
  switch(type) {
    case 'noop':
      return NoopState;
    case 'cic-scraper':
      return CicScraperState;
    default:
      throw new Error(`Unknown bot type '${type}'`);
    }
}

function useClearState(id: string) {
  const clearState = useAction(clearBotState);
  return useCallback(() => fireAsync(async () => clearState(id)), [id, clearState, fireAsync]);
}
import { React, mui, clsx, CriteriaField } from 'mylife-tools-ui';
import { NoopConfig, NoopState } from './config/noop';
import { CicScraperConfig, CicScraperState } from './config/cic-scraper';
import CronCriteriaField from './cron-criteria-field';

type FIXME_any = any;
type Bot = FIXME_any;

const useStyles = mui.makeStyles(theme => ({
  container: {
    overflowY: 'auto',
    padding: theme.spacing(1),
  }
}));
const Detail: React.FunctionComponent<{ bot: Bot; className?: string; }> = ({ bot, className }) => {
  const classes = useStyles();
  const Config = getConfigComponent(bot.type);
  const State = getStateComponent(bot.type);

  return (
    <div className={clsx(classes.container, className)}>
      <mui.Grid container spacing={2}>
        <mui.Grid item xs={12}>
          <CronCriteriaField value={bot.schedule} />
        </mui.Grid>

        <Config configuration={bot.configuration} />
        <State state={bot.state} />
      </mui.Grid>
    </div>
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
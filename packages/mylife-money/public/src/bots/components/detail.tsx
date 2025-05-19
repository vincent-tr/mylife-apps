import { React, mui, clsx, CriteriaField } from 'mylife-tools-ui';
import cronstrue from 'cronstrue';
import 'cronstrue/locales/fr';
import cronParser from 'cron-parser';

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

  return (
    <div className={clsx(classes.container, className)}>
      <mui.Grid container spacing={2}>
        <mui.Grid item xs={12}>
          <CronCriteriaField value={bot.schedule} />
        </mui.Grid>
      </mui.Grid>
    </div>
  );
};

export default Detail;

const CronCriteriaField: React.FunctionComponent<{ value: string; }> = ({ value }) => {

  return (
    <CriteriaField label={
      <>
        {'Planification '}
        <mui.Link href="https://github.com/node-cron/node-cron#cron-syntax" target="_blank" rel="noopener">
          "cron"
        </mui.Link>
      </>
    }>
      { value ? (
        <mui.TextField InputProps={{ readOnly: true }} value={value} helperText={format(value)} />
      ) : (
        <mui.TextField InputProps={{ readOnly: true }} value={'-'} helperText={' '} />
      )}
    </CriteriaField>
  );
};

export function validate(value: string) {
  if (!value) {
    return false;
  }
  
  try { 
    cronParser.parseExpression(value);
    cronstrue.toString(value);
    return true;
  } catch(e) {
    return false;
  }
}

export function format(value: string) {
  if (!validate(value)) {
    return '<invalide>';
  }

  return cronstrue.toString(value, { locale: 'fr' });
}

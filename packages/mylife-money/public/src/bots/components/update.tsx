import { React, mui, dialogs, useReducer, useMemo, CriteriaField, services } from 'mylife-tools-ui';
import { NoopConfig, validate as noopValidate } from './config/noop';
import { CicScraperConfig, validate as cicScraperValidate } from './config/cic-scraper';
import { FraisScraperConfig, validate as fraisScraperValidate } from './config/frais-scraper';
import { AmazonScraperConfig, validate as amazonScraperValidate } from './config/amazon-scraper';
import CronCriteriaField, { validate as cronValidate } from './cron-criteria-field';

type FIXME_any = any;
type Bot = FIXME_any;

type ProceedCallback = (arg: { result: 'ok' | 'cancel', values?: Partial<Bot> }) => void;

interface Options {
  bot: Bot; // set on update, null on create
}

const UpdateDialog: React.FunctionComponent<{ show: boolean; proceed: ProceedCallback; options: Options; }> = ({ show, proceed, options }) => (
  <mui.Dialog aria-labelledby='dialog-title' open={show}>
    <mui.DialogTitle id='dialog-title'>
      {options.bot ? 'Création de robot' : 'Modification de robot'}
    </mui.DialogTitle>

    <DialogContent bot={options.bot} proceed={proceed} />

  </mui.Dialog>
);

export default dialogs.create(UpdateDialog);

const DialogContent: React.FunctionComponent<{ bot: Bot; proceed: ProceedCallback; }> = ({ bot, proceed }) => {
  const { valid, updatedValues, shownValues, updateValues } = useBotValues(bot);
  const Config = getConfigComponent(shownValues.type);

  return (
    <>
      <mui.DialogContent dividers>
        <mui.Grid container spacing={2}>
          <mui.Grid item xs={6}>
            <CriteriaField label={services.getFieldName('bot', 'name')}>
              <mui.TextField value={shownValues.name} onChange={e => updateValues({ name: e.target.value })} />
            </CriteriaField>
          </mui.Grid>

          <mui.Grid item xs={6}>
            <CriteriaField label={services.getFieldName('bot', 'type')}>
              <mui.Select value={shownValues.type} onChange={e => updateValues({ type: e.target.value })}>
                <mui.MenuItem value={'noop'}>noop</mui.MenuItem>
                <mui.MenuItem value={'cic-scraper'}>cic-scraper</mui.MenuItem>
                <mui.MenuItem value={'frais-scraper'}>frais-scraper</mui.MenuItem>
                <mui.MenuItem value={'amazon-scraper'}>amazon-scraper</mui.MenuItem>
              </mui.Select>
            </CriteriaField>
          </mui.Grid>

          <mui.Grid item xs={12}>
            <CronCriteriaField value={shownValues.schedule} onChange={schedule => updateValues({ schedule })} />
          </mui.Grid>

          <Config configuration={shownValues.configuration} onChange={configuration => updateValues({ configuration })} />
        </mui.Grid>
      </mui.DialogContent>

      <mui.DialogActions>
        <mui.Button disabled={!valid} onClick={() => proceed({ result: 'ok', values: updatedValues })} color='primary'>OK</mui.Button>
        <mui.Button onClick={() => proceed({ result: 'cancel' })}>Annuler</mui.Button>
      </mui.DialogActions>
    </>
  );
};

const CREATE_BOT: Bot = {
  type: 'noop',
  name: '',
  schedule: '',
  configuration: null,
  state: null,
};

function useBotValues(bot: Bot) {
  // on create initialize with default values
  const [updatedValues, updateValues] = useReducer(botValuesReducer, bot ? {} : { ...CREATE_BOT });

  const { shownValues, valid } = useMemo(() => {
    const shownValues = { ...bot, ...updatedValues };
    const valid = validate(shownValues);
    return { shownValues, valid };
  }, [bot, updatedValues]);

  return { valid, updatedValues, shownValues, updateValues };
}

function botValuesReducer(state: Partial<Bot>, values: Partial<Bot>) {
  // on type change we need to reset state and configuration
  if (values.type) {
    values.state = null;
    values.configuration = null;
  }

  return { ...state, ...values };
}

function getConfigComponent(type: 'noop' | 'cic-scraper' | 'frais-scraper' | 'amazon-scraper') {
  switch (type) {
    case 'noop':
      return NoopConfig;
    case 'cic-scraper':
      return CicScraperConfig;
    case 'frais-scraper':
      return FraisScraperConfig;
    case 'amazon-scraper':
      return AmazonScraperConfig;
    default:
      throw new Error(`Unknown bot type '${type}'`);
  }
}

function validate(values: Partial<Bot>) {
  if (!values.name || !cronValidate(values.schedule)) {
    return false;
  }

  switch (values.type) {
    case 'noop':
      return noopValidate(values.configuration);
    case 'cic-scraper':
      return cicScraperValidate(values.configuration);
    case 'frais-scraper':
      return amazonScraperValidate(values.configuration);
    case 'amazon-scraper':
      return AmazonScraperConfig;
    default:
      return false;
  }
}

import { React, mui, CriteriaField } from 'mylife-tools-ui';
import * as shared from '../../../../../shared/bots';
import AccountSelector from '../../../common/components/account-selector';

type FIXME_any = any;
type Bot = FIXME_any;

type Configuration = shared.AmazonScraper.Configuration;
type State = shared.AmazonScraper.State;

const EMPTY = {};

interface AmazonScraperConfigProps {
  configuration: unknown;
  onChange?: (configuration: unknown) => void;
}

export const AmazonScraperConfig: React.FunctionComponent<AmazonScraperConfigProps> = ({ configuration: untypedConfig, onChange }) => {
  const configuration = (untypedConfig || EMPTY) as Configuration;

  const update = onChange && ((values: Partial<Configuration>) => {
    onChange({ ...configuration, ...values });
  });

  return (
    <>
      <mui.Grid item xs={12}>
        <CriteriaField label='Server IMAP'>
          <mui.TextField InputProps={{ readOnly: !update }} value={configuration.imapServer || ''} onChange={e => update({ imapServer: e.target.value })} />
        </CriteriaField>
      </mui.Grid>

      <mui.Grid item xs={12}>
        <CriteriaField label='Utilisateur IMAP'>
          <mui.TextField InputProps={{ readOnly: !update }} value={configuration.imapUser || ''} onChange={e => update({ imapUser: e.target.value })} />
        </CriteriaField>
      </mui.Grid>

      <mui.Grid item xs={12}>
        <CriteriaField label='Mot de passe IMAP'>
          <mui.TextField InputProps={{ readOnly: !update }} value={configuration.imapPass || ''} onChange={e => update({ imapPass: e.target.value })} />
        </CriteriaField>
      </mui.Grid>

      <mui.Grid item xs={12}>
        <CriteriaField label='Mailbox IMAP'>
          <mui.TextField InputProps={{ readOnly: !update }} value={configuration.mailbox || ''} onChange={e => update({ mailbox: e.target.value })} />
        </CriteriaField>
      </mui.Grid>

      <mui.Grid item xs={12}>
        <CriteriaField label='Mail: de'>
          <mui.TextField InputProps={{ readOnly: !update }} value={configuration.from || ''} onChange={e => update({ from: e.target.value })} />
        </CriteriaField>
      </mui.Grid>

      <mui.Grid item xs={12}>
        <CriteriaField label='Mail: depuis (jours)'>
          <mui.TextField InputProps={{ readOnly: !update, type: 'number' }} value={configuration.sinceDays || '0'} onChange={e => update({ sinceDays: safeParseInt(e.target.value) })} />
        </CriteriaField>
      </mui.Grid>

      <mui.Grid item xs={12}>
        <CriteriaField label='Compte Money'>
          <AccountSelector value={configuration.account} onChange={account => update({ account })} />
        </CriteriaField>
      </mui.Grid>

      <mui.Grid item xs={12}>
        <CriteriaField label='Nombre max. de jour pour match'>
          <mui.TextField InputProps={{ readOnly: !update, type: 'number' }} value={configuration.matchDaysDiff || '0'} onChange={e => update({ matchDaysDiff: safeParseInt(e.target.value) })} />
        </CriteriaField>
      </mui.Grid>

      <mui.Grid item xs={12}>
        <CriteriaField label='Libellé opération doit contenir pour match'>
          <mui.TextField InputProps={{ readOnly: !update }} value={configuration.matchLabel || ''} onChange={e => update({ matchLabel: e.target.value })} />
        </CriteriaField>
      </mui.Grid>

      <mui.Grid item xs={12}>
        <CriteriaField label='Template de note'>
          <mui.TextField InputProps={{ readOnly: !update }} multiline minRows={4} maxRows={4} value={configuration.template || ''} onChange={e => update({ template: e.target.value })} />
        </CriteriaField>
      </mui.Grid>
    </>
  );
};

interface AmazonScraperStateProps {
  state: unknown;
}

export const AmazonScraperState: React.FunctionComponent<AmazonScraperStateProps> = ({ state }) => {
  return (
    <></>
  );
};

export function validate(untypedConfig: unknown) {
  const configuration = (untypedConfig || EMPTY) as Configuration;
  return !!configuration.imapServer && !!configuration.imapUser && !!configuration.imapPass
    && !!configuration.mailbox && !!configuration.from && !!configuration.sinceDays
    && !!configuration.account && !!configuration.matchDaysDiff && !!configuration.matchLabel
    && !!configuration.template;
}

function safeParseInt(value: string) {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? 0 : parsed;
}
import { React, mui, CriteriaField, useCallback } from 'mylife-tools-ui';
import * as shared from '../../../../../shared/bots';
import AccountSelector from '../../../common/components/account-selector';
import icons from '../../../common/icons';

type FIXME_any = any;
type Bot = FIXME_any;

type Configuration = shared.CicScraper.Configuration;
type State = shared.CicScraper.State;

const EMPTY = {};

interface CicScraperConfigProps {
  configuration: unknown;
  onChange?: (configuration: unknown) => void;
}

export const CicScraperConfig: React.FunctionComponent<CicScraperConfigProps> = ({ configuration: untypedConfig, onChange }) => {
  const configuration = (untypedConfig || EMPTY) as Configuration;

  const update = onChange && ((values: Partial<Configuration>) => {
    onChange({ ...configuration, ...values });
  });

  return (
    <>
      <mui.Grid item xs={12}>
        <CriteriaField label='Utilisateur CIC'>
          <mui.TextField InputProps={{ readOnly: !update }} value={configuration.user || ''} onChange={e => update({ user: e.target.value })} />
        </CriteriaField>
      </mui.Grid>

      <mui.Grid item xs={12}>
        <CriteriaField label='Mot de passe CIC'>
          <mui.TextField InputProps={{ readOnly: !update }} value={configuration.pass || ''} onChange={e => update({ pass: e.target.value })} />
        </CriteriaField>
      </mui.Grid>

      <mui.Grid item xs={12}>
        <CriteriaField label='Compte Money'>
          <AccountSelector value={configuration.account} onChange={account => update({ account })} />
        </CriteriaField>
      </mui.Grid>
    </>
  );
};

interface CicScraperStateProps {
  state: unknown;
}

export const CicScraperState: React.FunctionComponent<CicScraperStateProps> = ({ state: untypedState }) => {
  const state = (untypedState || EMPTY) as State;

  return (
    <>
      {state.lastDownload && (
        <mui.Grid item xs={12}>
          <CriteriaField label={`Dernier fichier téléchargé (${state.lastDownload.date.toLocaleString('fr-FR')})`}>
            <mui.IconButton onClick={() => download(`cic-${formatFileDate(state.lastDownload.date)}.csv`, state.lastDownload.content)}>
              <icons.actions.Download />
            </mui.IconButton>
          </CriteriaField>
        </mui.Grid>
      )}
    </>
  );
};

function formatFileDate(date: Date) {
  return date.getFullYear().toString() + pad(date.getMonth() + 1) + pad(date.getDate()) + '-' + pad(date.getHours()) + pad(date.getMinutes()) + pad(date.getSeconds());
}

function pad(number: number) {
  return number < 10 ? '0' + number : number.toString();
}

// Note: should be an action, but this will bring cic scraper specifics to actions
// https://stackoverflow.com/questions/3665115/how-to-create-a-file-in-memory-for-user-to-download-but-not-through-server
function download(filename: string, text: string) {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

export function validate(untypedConfig: unknown) {
  const configuration = (untypedConfig || EMPTY) as Configuration;
  return !!configuration.user && !!configuration.pass && !!configuration.account;
}
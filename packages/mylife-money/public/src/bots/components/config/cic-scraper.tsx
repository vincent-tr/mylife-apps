import { React, mui, CriteriaField } from 'mylife-tools-ui';
import * as shared from '../../../../../shared/bots';
import AccountSelector from '../../../common/components/account-selector';

type FIXME_any = any;
type Bot = FIXME_any;

type Configuration = shared.CicScraper.Configuration;
type State = shared.CicScraper.State;

const EMPTY = {};

interface CicScraperConfigProps {
  bot: Bot;
  onChange?: (changes: Partial<Bot>) => void;
}

export const CicScraperConfig: React.FunctionComponent<CicScraperConfigProps> = ({ bot, onChange }) => {
  const configuration = bot.configuration || EMPTY as Configuration;

  return (
    <>
      <mui.Grid item xs={12}>
        <CriteriaField label='Utilisateur CIC'>
          <mui.TextField InputProps={{ readOnly: true }} value={configuration.user} />
        </CriteriaField>
      </mui.Grid>

      <mui.Grid item xs={12}>
        <CriteriaField label='Mot de passe CIC'>
          <mui.TextField InputProps={{ readOnly: true }} value={configuration.pass} />
        </CriteriaField>
      </mui.Grid>

      <mui.Grid item xs={12}>
        <CriteriaField label='Compte Money'>
          <AccountSelector value={configuration.account} />
        </CriteriaField>
      </mui.Grid>
    </>
  );
};

interface CicScraperStateProps {
  bot: Bot;
}

export const CicScraperState: React.FunctionComponent<CicScraperStateProps> = ({ bot }) => {
  const state = bot.state || EMPTY as State;

  return (
    <>
      <mui.Grid item xs={12}>
        <CriteriaField label='Dernier fichier téléchargé'>
          TODO
        </CriteriaField>
      </mui.Grid>

      <mui.Grid item xs={12}>
        <CriteriaField label={`Supprimer l'état`}>
          TODO
        </CriteriaField>
      </mui.Grid>
    </>
  );
};

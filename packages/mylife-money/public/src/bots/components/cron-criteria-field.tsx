import { React, mui, CriteriaField } from 'mylife-tools-ui';
import cronstrue from 'cronstrue';
import 'cronstrue/locales/fr';
import cronParser from 'cron-parser';

const CronCriteriaField: React.FunctionComponent<{ value: string; onChange?: (newValue: string) => void; }> = ({ value, onChange }) => {
  return (
    <CriteriaField label={
      <>
        {'Planification '}
        <mui.Link href="https://github.com/node-cron/node-cron#cron-syntax" target="_blank" rel="noopener">
          "cron"
        </mui.Link>
      </>
    }>
      <mui.TextField InputProps={{ readOnly: !onChange }} value={value} onChange={e => onChange(e.target.value)} helperText={format(value)} />
    </CriteriaField>
  );
};

export default CronCriteriaField;

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

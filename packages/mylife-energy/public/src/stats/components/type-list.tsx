import { React, mui, useCallback } from 'mylife-tools-ui';
import { StatsType } from '../actions';

export interface TypeListProps {
  value: StatsType;
  onChange: (newValue: StatsType) => void;
}

const TYPES = new Map([
  [StatsType.Day, 'Jour'],
  [StatsType.Month, 'Mois'],
  [StatsType.Year, 'Année'],
]);

const TypeList: React.FunctionComponent<TypeListProps> = ({ value, onChange }) => {
  const renderSelectorValue = useCallback((selection: unknown) => TYPES.get(selection as StatsType), []);

  return (
    <mui.Select
      value={value}
      onChange={event => onChange(event.target.value as StatsType)}
      input={<mui.Input fullWidth />}
      renderValue={renderSelectorValue}
    >
      {Array.from(TYPES.entries()).map(([id, display]) => (
        <mui.MenuItem key={id} value={id}>
          {display}
        </mui.MenuItem>
      ))}
    </mui.Select>
  );
};

export default TypeList;

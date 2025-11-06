import React, { useCallback } from 'react';
import { mui } from 'mylife-tools-ui';
import { StatsType } from '../actions';

export interface TypeListProps {
  className?: string;
  value: StatsType;
  onChange: (newValue: StatsType) => void;
}

const TYPES = new Map([
  [StatsType.Day, 'Jour'],
  [StatsType.Month, 'Mois'],
  [StatsType.Year, 'Année'],
]);

const TypeList: React.FunctionComponent<TypeListProps> = ({ className, value, onChange }) => {
  const renderSelectorValue = useCallback((selection: unknown) => TYPES.get(selection as StatsType), []);

  return (
    <mui.Select
      value={value}
      onChange={event => onChange(event.target.value as StatsType)}
      input={<mui.Input fullWidth />}
      renderValue={renderSelectorValue}
      className={className}
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

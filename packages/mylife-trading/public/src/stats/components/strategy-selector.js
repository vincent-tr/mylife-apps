'use strict';

import { React, PropTypes, useMemo, ListSelector } from 'mylife-tools-ui';
import { useStrategyView } from '../../common/shared-views';

const StrategySelector = ({ value, onChange }) => {
  const { strategies } = useStrategyView();
  const list = useMemo(() => [{ id: null, text: '(Aucun)' }, ...strategies.map(strategy => ({ id: strategy._id, text: strategy.display }))], [strategies]);
  return (
    <ListSelector list={list} value={value} onChange={onChange} />
  );
};

StrategySelector.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};
  
export default StrategySelector;
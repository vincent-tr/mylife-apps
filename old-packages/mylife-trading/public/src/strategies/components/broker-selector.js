'use strict';

import { React, PropTypes, useMemo, ListSelector } from 'mylife-tools-ui';
import { useBrokerView } from '../../common/shared-views';

const BrokerSelector = ({ value, onChange, ...props }) => {
  const { brokers } = useBrokerView();
  const list = useMemo(() => brokers.map(broker => ({ id: broker._id, text: broker.display })), [brokers]);
  return (
    <ListSelector list={list} value={value} onChange={onChange} {...props} />
  );
};

BrokerSelector.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};
  
export default BrokerSelector;
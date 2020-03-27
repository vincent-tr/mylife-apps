'use strict';

import { React, PropTypes, useMemo, ListSelector } from 'mylife-tools-ui';
import { useBrokerView } from '../../common/broker-view';

const BrokerSelector = ({ value, onChange }) => {
  const { brokers } = useBrokerView();
  const list = useMemo(() => brokers.map(broker => ({ id: broker._id, text: broker.display })), [brokers]);
  return (
    <ListSelector list={list} value={value} onChange={onChange} />
  );
};

BrokerSelector.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};
  
export default BrokerSelector;
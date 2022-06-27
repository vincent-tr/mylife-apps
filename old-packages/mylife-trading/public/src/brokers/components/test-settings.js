'use strict';

import { React, PropTypes, mui, DebouncedTextField, useRefProp, services } from 'mylife-tools-ui';

const TestSettings = ({ broker, update: updateBroker }) => {
  const structure = services.getFieldDatatype('broker', 'testSettings');
  const { testSettings } = broker;

  const settingsRef = useRefProp(testSettings);

  const update = (values) => {
    const testSettings = settingsRef.current;
    const merged = { ...testSettings, ...values };
    updateBroker(broker, { testSettings: merged });
  };

  return (
    <>
      <mui.Grid item xs={6}>
        <mui.Typography>{services.getStructureFieldName(structure, 'instrumentId')}</mui.Typography>
      </mui.Grid>
      <mui.Grid item xs={6}>
        <DebouncedTextField value={testSettings.instrumentId} onChange={instrumentId => update({ instrumentId })} fullWidth />
      </mui.Grid>

      <mui.Grid item xs={6}>
        <mui.Typography>{services.getStructureFieldName(structure, 'resolution')}</mui.Typography>
      </mui.Grid>
      <mui.Grid item xs={6}>
        <DebouncedTextField value={testSettings.resolution} onChange={resolution => update({ resolution })} fullWidth />
      </mui.Grid>

      <mui.Grid item xs={6}>
        <mui.Typography>{services.getStructureFieldName(structure, 'spread')}</mui.Typography>
      </mui.Grid>
      <mui.Grid item xs={6}>
        <DebouncedTextField value={testSettings.spread} onChange={value => update({ spread: parseFloat(value) })} type='number' fullWidth />
      </mui.Grid>
    </>
  );
};

TestSettings.propTypes = {
  broker: PropTypes.object.isRequired,
  update: PropTypes.func.isRequired,
};

export default TestSettings;

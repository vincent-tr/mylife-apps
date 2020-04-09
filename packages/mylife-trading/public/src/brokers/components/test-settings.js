'use strict';

import { React, PropTypes, mui, DebouncedTextField } from 'mylife-tools-ui';
import { getFieldDatatype, getStructureFieldName } from '../../common/metadata-utils';

const TestSettings = ({ broker, update }) => {
  const structure = getFieldDatatype('broker', 'testSettings');

  return (
    <>
      <mui.Grid item xs={6}>
        <mui.Typography>{getStructureFieldName(structure, 'instrumentId')}</mui.Typography>
      </mui.Grid>
      <mui.Grid item xs={6}>
        <DebouncedTextField value={broker.instrumentId} onChange={instrumentId => update(broker, { instrumentId })} fullWidth />
      </mui.Grid>

      <mui.Grid item xs={6}>
        <mui.Typography>{getStructureFieldName(structure, 'resolution')}</mui.Typography>
      </mui.Grid>
      <mui.Grid item xs={6}>
        <DebouncedTextField value={broker.resolution} onChange={resolution => update(broker, { resolution })} fullWidth />
      </mui.Grid>

      <mui.Grid item xs={6}>
        <mui.Typography>{getStructureFieldName(structure, 'spread')}</mui.Typography>
      </mui.Grid>
      <mui.Grid item xs={6}>
        <DebouncedTextField value={broker.spread} onChange={spread => update(broker, { spread })} type='number' fullWidth />
      </mui.Grid>
    </>
  );
};

TestSettings.propTypes = {
  broker: PropTypes.object.isRequired,
  update: PropTypes.func.isRequired,
};

export default TestSettings;

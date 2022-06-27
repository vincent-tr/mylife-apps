'use strict';

import { React, PropTypes, mui, DebouncedTextField, useRefProp, services } from 'mylife-tools-ui';
import PasswordField from './password-field';

const Broker = ({ broker, update: updateBroker }) => {
  const structure = services.getFieldDatatype('broker', 'credentials');
  const { credentials } = broker;

  const credentialsRef = useRefProp(credentials);

  const update = (values) => {
    const credentials = credentialsRef.current;
    const merged = { ...credentials, ...values, password: undefined };
    if(values.password) {
      merged.password = values.password;
    }

    updateBroker(broker, { credentials: merged });
  };

  return (
    <>
      <mui.Grid item xs={6}>
        <mui.Typography>{services.getStructureFieldName(structure, 'key')}</mui.Typography>
      </mui.Grid>
      <mui.Grid item xs={6}>
        <DebouncedTextField value={credentials.key} onChange={key => update({ key })} fullWidth />
      </mui.Grid>

      <mui.Grid item xs={6}>
        <mui.Typography>{services.getStructureFieldName(structure, 'identifier')}</mui.Typography>
      </mui.Grid>
      <mui.Grid item xs={6}>
        <DebouncedTextField value={credentials.identifier} onChange={identifier => update({ identifier })} fullWidth />
      </mui.Grid>

      <mui.Grid item xs={6}>
        <mui.Typography>{services.getStructureFieldName(structure, 'password')}</mui.Typography>
      </mui.Grid>
      <mui.Grid item xs={6}>
        <PasswordField crypted={credentials.password} onSet={password => update({ password })} fullWidth />
      </mui.Grid>
    </>
  );
};

Broker.propTypes = {
  broker: PropTypes.object.isRequired,
  update: PropTypes.func.isRequired,
};

export default Broker;

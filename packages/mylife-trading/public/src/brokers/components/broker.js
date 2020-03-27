'use strict';

import { React, useMemo, useState, useEffect, mui, useDispatch, DebouncedTextField, DeleteButton } from 'mylife-tools-ui';
import { update, remove } from '../actions';
import { getFieldName, renderObject } from '../../common/metadata-utils';

const useConnect = () => {
  const dispatch = useDispatch();
  return useMemo(() => ({
    update: (broker, changes) => dispatch(update(broker, changes)),
    remove: (broker) => dispatch(remove(broker)),
  }), [dispatch]);
};

const PasswordField = ({ crypted, onSet, ...props }) => {
  const [value, setValue] = useState('');
  // reset value on change
  useEffect(() => setValue(''), [crypted]);

  const handleOk = () => onSet(value);

  const handleMouseDownPassword = event => {
    event.preventDefault();
  };

  const inputProps = value ? {
    endAdornment:
      <mui.InputAdornment position='end'>
        <mui.IconButton
          onClick={handleOk}
          onMouseDown={handleMouseDownPassword}
        >
          <mui.icons.Create />
        </mui.IconButton>
      </mui.InputAdornment>
  } : null;

  return (
    <mui.TextField 
      value={value}
      onChange={e => setValue(e.target.value)}
      type='password'
      InputProps={inputProps}
      {...props}
    />
  );
};

const Broker = ({ broker }) => {
  const { update, remove } = useConnect();

  return (
    <mui.Grid container spacing={2}>
      <mui.Grid item xs={6}>
        <mui.Typography>{getFieldName('broker', 'display')}</mui.Typography>
      </mui.Grid>
      <mui.Grid item xs={6}>
        <DebouncedTextField value={broker.display} onChange={display => update(broker, { display })} fullWidth />
      </mui.Grid>
      <mui.Grid item xs={6}>
        <mui.Typography>{getFieldName('broker', 'key')}</mui.Typography>
      </mui.Grid>
      <mui.Grid item xs={6}>
        <DebouncedTextField value={broker.key} onChange={key => update(broker, { key })} fullWidth />
      </mui.Grid>
      <mui.Grid item xs={6}>
        <mui.Typography>{getFieldName('broker', 'identifier')}</mui.Typography>
      </mui.Grid>
      <mui.Grid item xs={6}>
        <DebouncedTextField value={broker.identifier} onChange={identifier => update(broker, { identifier })} fullWidth />
      </mui.Grid>
      <mui.Grid item xs={6}>
        <mui.Typography>{getFieldName('broker', 'password')}</mui.Typography>
      </mui.Grid>
      <mui.Grid item xs={6}>
        <PasswordField crypted={broker.password} onSet={password => update(broker, { password })} fullWidth />
      </mui.Grid>
      <mui.Grid item xs={6}>
        <mui.Typography>{getFieldName('broker', 'demo')}</mui.Typography>
      </mui.Grid>
      <mui.Grid item xs={6}>
        <mui.Checkbox checked={broker.demo} onChange={e => update(broker, { demo: e.target.checked })} />
      </mui.Grid>

      <DeleteButton
        tooltip={'Supprimer le compte'}
        icon
        text='Supprimer'
        confirmText={`Etes-vous sûr de vouloir supprimer le compte '${renderObject(broker)}' ?`}
        onConfirmed={() => remove(broker)}
      />

    </mui.Grid>
  );
};

export default Broker;

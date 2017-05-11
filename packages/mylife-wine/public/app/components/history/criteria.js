'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import * as mui from 'material-ui';
import icons from '../icons';
import common from '../common/index';

const styles = {
  fieldTitle: {
    fontWeight: 'bold',
    width: 300,
    display: 'inline-block',
    textAlign: 'left'
  },
  radioButton: {
    display : 'inline-block',
    width   : 100,
    margin  : '0 20px 0 20px'
  }
};

const Criteria = ({ regions, types, criteria, onChange, onRefresh }) => {
  const { type, region, name, minDate, maxDate, isAdd } = criteria;

  const nameChange    = (event) => onChange({ name: event.target.value || null });
  const typeChange    = (event, index, value) => onChange({ type: value });
  const regionChange  = (event, index, value) => onChange({ region: value });
  const minDateChange = (_, value) => onChange({ minDate: value });
  const maxDateChange = (_, value) => onChange({ maxDate: value });
  const isAddChange   = (event, value) => onChange({ isAdd: value === 'null' ? null : value });

  return (
    <table style={{tableLayout: 'fixed', width: '100%'}}>
      <tbody>
        <tr>
          <td><div style={styles.fieldTitle}>Type de spiritueux</div></td>
          <td><common.ReferenceSelector id="type" autoWidth={false} style={{ width: 300 }} list={types} value={type} onChange={typeChange} /></td>

          <td><div style={styles.fieldTitle}>Date début</div></td>
          <td>
            <mui.DatePicker id="minDate" style={{ width: 300, display: 'inline-block' }} value={minDate} onChange={minDateChange} />
            <mui.IconButton tooltip="Pas de date de début"
                            onClick={() => minDateChange(null)}>
              <icons.actions.Delete />
            </mui.IconButton>
          </td>

          <td rowSpan={3}>
            <mui.IconButton onClick={() => onRefresh()}
                            tooltip="Rafraîchir">
              <icons.actions.Refresh />
            </mui.IconButton>
          </td>
        </tr>
        <tr>
          <td><div style={styles.fieldTitle}>Region</div></td>
          <td><common.ReferenceSelector id="region" autoWidth={false} style={{ width: 300 }} list={regions} value={region} onChange={regionChange} /></td>

          <td><div style={styles.fieldTitle}>Date fin</div></td>
          <td>
            <mui.DatePicker id="maxDate" style={{ width: 300, display: 'inline-block' }} value={maxDate} onChange={maxDateChange} />
            <mui.IconButton tooltip="Pas de date de fin"
                            onClick={() => maxDateChange(null)}>
              <icons.actions.Delete />
            </mui.IconButton>
          </td>
        </tr>
        <tr>
          <td><div style={styles.fieldTitle}>Appelation</div></td>
          <td><mui.TextField id="name" style={{ width: 300 }} value={name || ''} onChange={nameChange} /></td>

          <td><div style={styles.fieldTitle}>Type d'opération</div></td>
          <td>
            <mui.RadioButtonGroup name="operationType" valueSelected={isAdd === null ? 'null' : isAdd} onChange={isAddChange}>
              <mui.RadioButton style={styles.radioButton} value={'null'} label="Tous" />
              <mui.RadioButton style={styles.radioButton} value={true} label={<div style={{width: 100}}><img src="images/misc/arrow-right-green-256.png" height="20" width="20" style={{marginRight: 10}} />Entrées</div>} />
              <mui.RadioButton style={styles.radioButton} value={false} label={<div style={{width: 100}}><img src="images/misc/arrow-left-red-256.png" height="20" width="20" style={{marginRight: 10}} />Sorties</div>} />
            </mui.RadioButtonGroup>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

Criteria.propTypes = {
  regions   : PropTypes.arrayOf(PropTypes.object),
  types     : PropTypes.arrayOf(PropTypes.object),
  criteria  : PropTypes.object.isRequired,
  onChange  : PropTypes.func.isRequired,
  onRefresh : PropTypes.func.isRequired,
};

export default Criteria;
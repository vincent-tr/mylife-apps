'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import base from '../base/index';

const ReportSelector = ({ value, onChange }) => (
  <base.SelectableList selectedNode={{value}}
            selectedValueChanged={(obj) => onChange(obj.value)}>
    <base.SelectableListItem value={{ value: 'groupAbsoluteByMonth'}} primaryText="Montant par mois d'un groupe"/>
    <base.SelectableListItem value={{ value: 'todo'}} primaryText="Report #2"/>
  </base.SelectableList>
);

ReportSelector.propTypes = {
  value    : PropTypes.string,
  onChange : PropTypes.func.isRequired
};

export default ReportSelector;
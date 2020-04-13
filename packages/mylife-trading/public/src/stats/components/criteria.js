'use strict';

import { React, PropTypes, mui, SummaryExpansionPanel, CriteriaField } from 'mylife-tools-ui';
import StrategySelector from './strategy-selector';

const ExpandedSummary = () => {
  return (
    <mui.Typography variant='h6'>Critères de sélection</mui.Typography>
  );
};

const CollapsedSummary = ({ criteria }) => {
  return (
    <mui.Typography>{`TODO collapsed title`}</mui.Typography>
  );
};

CollapsedSummary.propTypes = {
  criteria: PropTypes.object.isRequired
};

const Criteria = ({ criteria, onCriteriaChanged }) => {
  const setCriteria = (name, value) => onCriteriaChanged({ ...criteria, [name]: value });

  return (
    <SummaryExpansionPanel
      expandedSummary={<ExpandedSummary criteria={criteria} />}
      collapsedSummary={<CollapsedSummary criteria={criteria} />}>
      <mui.Grid container spacing={2}>
        <mui.Grid item xs={12}>
          <CriteriaField label='Stratégie'>
            <StrategySelector value={criteria.strategy} onChange={(value) => setCriteria('strategy', value)} width={200} />
          </CriteriaField>
        </mui.Grid>
      </mui.Grid>
    </SummaryExpansionPanel>
  );
};

Criteria.propTypes = {
  criteria: PropTypes.object.isRequired,
  onCriteriaChanged: PropTypes.func.isRequired,
};

export default Criteria;

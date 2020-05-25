'use strict';

import { React, PropTypes, mui, SummaryExpansionPanel, CriteriaField, ListSelector } from 'mylife-tools-ui';
import { useStrategyView } from '../../common/shared-views';
import StrategySelector from './strategy-selector';
import { groupBy, aggregation, chartType } from './lists';

const ExpandedSummary = () => {
  return (
    <mui.Typography variant='h6'>Critères de sélection</mui.Typography>
  );
};

const CollapsedSummary = ({ criteria }) => {
  const { view } = useStrategyView();
  const strategy = criteria.strategy && view.get(criteria.strategy);
  const groupByItem = groupBy.find(item => item.id === criteria.groupBy);
  const aggregationItem = aggregation.find(item => item.id === criteria.aggregation);
  return (
    <mui.Typography>{`${strategy ? strategy.display : '(Pas de stratégie)'}: '${aggregationItem.text}' groupé par '${groupByItem.text}'`}</mui.Typography>
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

        <mui.Grid item xs={12}>
          <CriteriaField label='Regroupement'>
            <ListSelector list={groupBy} value={criteria.groupBy} onChange={(value) => setCriteria('groupBy', value)} width={200} />
          </CriteriaField>
        </mui.Grid>

        <mui.Grid item xs={12}>
          <CriteriaField label='Aggrégation'>
            <ListSelector list={aggregation} value={criteria.aggregation} onChange={(value) => setCriteria('aggregation', value)} width={200} />
          </CriteriaField>
        </mui.Grid>

        <mui.Grid item xs={12}>
          <CriteriaField label='Type de chart'>
            <ListSelector list={chartType} value={criteria.chartType} onChange={(value) => setCriteria('chartType', value)} width={200} />
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

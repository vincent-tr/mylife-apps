'use strict';

import { React, PropTypes, mui, SummaryExpansionPanel, CriteriaField, ListSelector } from 'mylife-tools-ui';
import { useStrategyView } from '../../common/strategy-view';
import StrategySelector from './strategy-selector';

const timeAggregation = [
  { id: 'day', text: 'Jour' },
  { id: 'month', text: 'Mois' },
  { id: 'year', text: 'Année' },
  { id: 'day-hour', text: 'Heure de la journée' }
];

const ExpandedSummary = () => {
  return (
    <mui.Typography variant='h6'>Critères de sélection</mui.Typography>
  );
};

const CollapsedSummary = ({ criteria }) => {
  const { strategyView } = useStrategyView();
  const strategy = criteria.strategy && strategyView.get(criteria.strategy);
  const aggregation = timeAggregation.find(item => item.id === criteria.timeAggregation);
  return (
    <mui.Typography>{`${strategy ? strategy.display : '(Pas de stratégie)'} aggrégé par ${aggregation.text}`}</mui.Typography>
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

        <mui.Grid item xs={6}>
          <CriteriaField label='Stratégie'>
            <StrategySelector value={criteria.strategy} onChange={(value) => setCriteria('strategy', value)} width={200} />
          </CriteriaField>
        </mui.Grid>

        <mui.Grid item xs={6}>
          <CriteriaField label='Aggrégation de temps'>
            <ListSelector list={timeAggregation} value={criteria.timeAggregation} onChange={(value) => setCriteria('timeAggregation', value)} width={200} />
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

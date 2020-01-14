'use strict';

import { React, PropTypes, mui, SummaryExpansionPanel } from 'mylife-tools-ui';
import CriteriaGrid from './criteria-grid';

const useStyles = mui.makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: {
    marginRight: theme.spacing(4)
  }
}));

const ExpandedSummary = () => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <mui.Typography variant='h6' className={classes.title}>Critères de sélection</mui.Typography>
    </div>
  );
};

ExpandedSummary.propTypes = {
};

const CollapsedSummary = ({ criteria }) => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <mui.Typography className={classes.title}>{CollapsedTitleFormatter.generate(criteria)}</mui.Typography>
    </div>
  );
};

CollapsedSummary.propTypes = {
  criteria: PropTypes.object.isRequired
};

const Criteria = ({ className, criteria, onCriteriaChanged, display, onDisplayChanged }) => {
  return (
    <SummaryExpansionPanel
      className={className}
      initialExpanded={false}
      expandedSummary={<ExpandedSummary criteria={criteria} display={display} />}
      collapsedSummary={<CollapsedSummary criteria={criteria} display={display} />}>
      <CriteriaGrid criteria={criteria} onCriteriaChanged={onCriteriaChanged} display={display} onDisplayChanged={onDisplayChanged} />
    </SummaryExpansionPanel>
  );
};

Criteria.propTypes = {
  className: PropTypes.string,
  criteria: PropTypes.object.isRequired,
  onCriteriaChanged: PropTypes.func.isRequired,
  display: PropTypes.object.isRequired,
  onDisplayChanged: PropTypes.func.isRequired
};

export default Criteria;

class CollapsedTitleFormatter {

  static generate(criteria) {
    return new CollapsedTitleFormatter(criteria).result();
  }

  constructor(criteria) {
    this.criteria = criteria;
    this.parts = [];

    this.addTexts();

    this.addDefault();
  }

  addTexts() {
    for(const prop of ['keywords', 'title']) {
      const value = this.criteria[prop];
      if(value) {
        this.parts.push(`'${value}'`);
      }
    }
  }

  addDefault() {
    if(this.parts.length === 0) {
      this.parts.push('<Aucun critère>');
    }
  }

  result() {
    return this.parts.join(', ');
  }
}

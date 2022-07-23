'use strict';

import { React, PropTypes, mui, SummaryAccordion } from 'mylife-tools-ui';
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

const ExpandedSummary: React.FunctionComponent = () => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <mui.Typography variant='h6' className={classes.title}>Critères de sélection</mui.Typography>
    </div>
  );
};

ExpandedSummary.propTypes = {
};

const CollapsedSummary: React.FunctionComponent<{ criteria }> = ({ criteria }) => {
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
    <SummaryAccordion
      className={className}
      initialExpanded={false}
      expandedSummary={<ExpandedSummary />}
      collapsedSummary={<CollapsedSummary criteria={criteria} />}>
      <CriteriaGrid criteria={criteria} onCriteriaChanged={onCriteriaChanged} display={display} onDisplayChanged={onDisplayChanged} />
    </SummaryAccordion>
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
    const formatter = new CollapsedTitleFormatter(criteria);
    formatter.addTexts();
    formatter.addDefault();
    return formatter.result();
  }

  private readonly parts: string[] = [];

  private constructor(private readonly criteria) {
  }

  private addTexts() {
    for(const prop of ['keywords', 'title']) {
      const value = this.criteria[prop];
      if(value) {
        this.parts.push(`'${value}'`);
      }
    }
  }

  private addDefault() {
    if(this.parts.length === 0) {
      this.parts.push('<Aucun critère>');
    }
  }

  private result() {
    return this.parts.join(', ');
  }
}

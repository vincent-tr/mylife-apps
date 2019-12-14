'use strict';

import { React, PropTypes, mui, formatDate, SummaryExpansionPanel } from 'mylife-tools-ui';
import CriteriaGrid from './criteria-grid';
import { DOCUMENT_TYPE_MAP } from '../../common/document-utils';

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

    this.addDates();
    this.addTypes();
    // albums
    // persons
    this.addTexts();

    this.addDefault();
  }

  addDates() {
    // only format one date range
    if (this.criteria.minDate) {
      this.parts.push(this.formatDateRange(this.criteria.minDate, this.criteria.maxDate));
      return;
    }

    if (this.criteria.minIntegrationDate) {
      this.parts.push(this.formatDateRange(this.criteria.minIntegrationDate, this.criteria.maxIntegrationDate));
      return;
    }
  }

  addTypes() {
    if(this.criteria.type.size === 0) {
      return;
    }

    const types = this.criteria.type.toArray().map(id => DOCUMENT_TYPE_MAP.get(id)).join(' ou ');
    this.parts.push(types);
  }

  addTexts() {
    for(const prop of ['keywords', 'caption', 'path']) {
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

  formatDateRange(min, max) {
    return `Du ${this.formatNullableDate(min)} au ${this.formatNullableDate(max)}`;
  }

  formatNullableDate(date) {
    if(!date) {
      return '<indéfini>';
    }
    return formatDate(date, 'dd/MM/yyyy');
  }
}

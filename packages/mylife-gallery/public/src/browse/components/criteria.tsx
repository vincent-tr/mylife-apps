'use strict';

import { React, PropTypes, mui, formatDate, SummaryAccordion } from 'mylife-tools-ui';
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
    <SummaryAccordion
      className={className}
      expandedSummary={<ExpandedSummary criteria={criteria} display={display} />}
      collapsedSummary={<CollapsedSummary criteria={criteria} display={display} />}>
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
    
    formatter.addDates();
    formatter.addTypes();
    formatter.addAlbums();
    formatter.addPersons();
    formatter.addTexts();

    formatter.addDefault();

    return formatter.result();
  }

  private readonly parts: string[] = [];

  private constructor(private readonly criteria) {
  }

  private addDates() {
    if(this.criteria.noDate) {
      this.parts.push('aucune date');
      return;
    }

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

  private addTypes() {
    if(this.criteria.type.size === 0) {
      return;
    }

    const types = this.criteria.type.toArray().map(id => DOCUMENT_TYPE_MAP.get(id)).join(' ou ');
    this.parts.push(types);
  }

  private addAlbums() {
    if(this.criteria.noAlbum) {
      this.parts.push('aucun album');
      return;
    }

    const { size } = this.criteria.albums;
    if(size > 0) {
      this.parts.push(`${size} album(s)`);
    }
  }

  private addPersons() {
    if(this.criteria.noPerson) {
      this.parts.push('aucune personne');
      return;
    }

    const { size } = this.criteria.persons;
    if(size > 0) {
      this.parts.push(`${size} personne(s)`);
    }
  }

  private addTexts() {
    for(const prop of ['keywords', 'caption', 'path']) {
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

  private formatDateRange(min, max) {
    return `Du ${this.formatNullableDate(min)} au ${this.formatNullableDate(max)}`;
  }

  private formatNullableDate(date) {
    if(!date) {
      return '<indéfini>';
    }
    return formatDate(date, 'dd/MM/yyyy');
  }
}

'use strict';

import { React, PropTypes, mui, DebouncedTextField, ListSelector } from 'mylife-tools-ui';
import SortOrderSelector from '../../common/sort-order-selector';
import CriteriaGridSimpleField from '../../common/criteria-grid-simple-field';

const sortFields = [
  { id: 'title', text: 'Titre' },
  { id: 'docCount', text: 'Nombre de documents' }
];

const useStyles = mui.makeStyles({
  selector: {
    minWidth: 160
  }
});

const CriteriaGrid = ({ criteria, onCriteriaChanged, display, onDisplayChanged }) => {
  const classes = useStyles();
  return (
    <mui.Grid container spacing={2}>
      <CriteriaGridSimpleField width={6} label='Titre' editor={DebouncedTextField} propName='title' object={criteria} onObjectChanged={onCriteriaChanged} fullWidth />
      <CriteriaGridSimpleField width={6} label='Mots clés' editor={DebouncedTextField} propName='keywords' object={criteria} onObjectChanged={onCriteriaChanged} fullWidth />

      <CriteriaGridSimpleField width={2} label='Tri' editor={ListSelector} propName='sortField' object={display} onObjectChanged={onDisplayChanged} list={sortFields} className={classes.selector} />
      <CriteriaGridSimpleField width={3} label='' editor={SortOrderSelector} propName='sortOrder' object={display} onObjectChanged={onDisplayChanged} className={classes.selector} />
    </mui.Grid>
  );
};

CriteriaGrid.propTypes = {
  className: PropTypes.string,
  criteria: PropTypes.object.isRequired,
  onCriteriaChanged: PropTypes.func.isRequired,
  display: PropTypes.object.isRequired,
  onDisplayChanged: PropTypes.func.isRequired
};

export default CriteriaGrid;

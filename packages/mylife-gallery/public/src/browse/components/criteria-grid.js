'use strict';

import { React, PropTypes, mui, DateOrYearSelector, DebouncedTextField, ListSelector } from 'mylife-tools-ui';
import TypeSelector from './type-selector';
import AlbumSelector from './album-selector';
import PersonSelector from './person-selector';
import SortOrderSelector from '../../common/sort-order-selector';
import CriteriaGridSimpleField from '../../common/criteria-grid-simple-field';

const WrappedCheckbox = ({ value, onChange, ...props }) => (
  <mui.Checkbox color='primary' checked={value} onChange={e => onChange(e.target.checked)} {...props} />
);

WrappedCheckbox.propTypes = {
  value: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired
};

const sortFields = [
  { id: null, text: '<Aucun>' },
  { id: 'title', text: 'Titre' },
  { id: 'date', text: 'Date' },
  { id: 'integrationDate', text: 'Date d\'intégration' },
  { id: 'path', text: 'Chemin du fichier' },
  { id: 'fileSize', text: 'Taille du fichier' }
];

const orientationFields = [
  { id: null, text: '<Tous>' },
  { id: 'landscape', text: 'Paysage' },
  { id: 'portrait', text: 'Portrait' }
];

const useStyles = mui.makeStyles({
  selector: {
    minWidth: 160
  }
});

const CriteriaGrid = ({ criteria, onCriteriaChanged, display, onDisplayChanged }) => {
  const classes = useStyles();

  const onNoDateCriteriaChanged = newCriteria => {
    if(newCriteria.noDate) {
      newCriteria = { ...newCriteria, minDate: null, maxDate: null };
    }
    onCriteriaChanged(newCriteria);
  };

  const onNoAlbumCriteriaChanged = newCriteria => {
    if(newCriteria.noAlbum) {
      newCriteria = { ...newCriteria, albums: criteria.albums.clear() };
    }
    onCriteriaChanged(newCriteria);
  };

  const onNoPersonCriteriaChanged = newCriteria => {
    if(newCriteria.noPerson) {
      newCriteria = { ...newCriteria, persons: criteria.persons.clear() };
    }
    onCriteriaChanged(newCriteria);
  };

  return (
    <mui.Grid container spacing={2}>
      <CriteriaGridSimpleField width={2} label='Date du document' />
      <CriteriaGridSimpleField width={2} label='Début' editor={DateOrYearSelector} propName='minDate' object={criteria} onObjectChanged={onCriteriaChanged} showYearSelector disabled={criteria.noDate} />
      <CriteriaGridSimpleField width={2} label='Fin' editor={DateOrYearSelector} propName='maxDate' object={criteria} onObjectChanged={onCriteriaChanged} showYearSelector selectLastDay disabled={criteria.noDate} />
      <CriteriaGridSimpleField width={1} label='Aucune' editor={WrappedCheckbox} propName='noDate' object={criteria} onObjectChanged={onNoDateCriteriaChanged} />

      <CriteriaGridSimpleField width={1} label={'Date d\'intégration'} />
      <CriteriaGridSimpleField width={2} label='Début' editor={DateOrYearSelector} propName='minIntegrationDate' object={criteria} onObjectChanged={onCriteriaChanged} showYearSelector />
      <CriteriaGridSimpleField width={2} label='Fin' editor={DateOrYearSelector} propName='maxIntegrationDate' object={criteria} onObjectChanged={onCriteriaChanged} showYearSelector selectLastDay />

      <CriteriaGridSimpleField width={2} label='Type' editor={TypeSelector} propName='type' object={criteria} onObjectChanged={onCriteriaChanged} className={classes.selector} />
      <CriteriaGridSimpleField width={4} label='Albums' editor={AlbumSelector} propName='albums' object={criteria} onObjectChanged={onCriteriaChanged} className={classes.selector} disabled={criteria.noAlbum} />
      <CriteriaGridSimpleField width={1} label='Aucun' editor={WrappedCheckbox} propName='noAlbum' object={criteria} onObjectChanged={onNoAlbumCriteriaChanged} />
      <CriteriaGridSimpleField width={4} label='Personnes' editor={PersonSelector} propName='persons' object={criteria} onObjectChanged={onCriteriaChanged} className={classes.selector} disabled={criteria.noPerson} />
      <CriteriaGridSimpleField width={1} label='Aucun' editor={WrappedCheckbox} propName='noPerson' object={criteria} onObjectChanged={onNoPersonCriteriaChanged} />

      <CriteriaGridSimpleField width={3} label='Mots clés' editor={DebouncedTextField} propName='keywords' object={criteria} onObjectChanged={onCriteriaChanged} fullWidth />
      <CriteriaGridSimpleField width={3} label='Légende' editor={DebouncedTextField} propName='caption' object={criteria} onObjectChanged={onCriteriaChanged} fullWidth />
      <CriteriaGridSimpleField width={5} label='Chemin du fichier' editor={DebouncedTextField} propName='path' object={criteria} onObjectChanged={onCriteriaChanged} fullWidth />
      <CriteriaGridSimpleField width={1} label='Doublons' editor={WrappedCheckbox} propName='pathDuplicate' object={criteria} onObjectChanged={onCriteriaChanged} />

      <CriteriaGridSimpleField width={2} label='Image/Vidéo' />
      <CriteriaGridSimpleField width={1} label='Largueur' />
      <CriteriaGridSimpleField width={1} label='Min' editor={DebouncedTextField} propName='minWidth' object={criteria} onObjectChanged={onCriteriaChanged} type='number' />
      <CriteriaGridSimpleField width={1} label='Max' editor={DebouncedTextField} propName='maxWidth' object={criteria} onObjectChanged={onCriteriaChanged} type='number' />
      <CriteriaGridSimpleField width={1} label='Hauteur' />
      <CriteriaGridSimpleField width={1} label='Min' editor={DebouncedTextField} propName='minHeight' object={criteria} onObjectChanged={onCriteriaChanged} type='number' />
      <CriteriaGridSimpleField width={1} label='Max' editor={DebouncedTextField} propName='maxHeight' object={criteria} onObjectChanged={onCriteriaChanged} type='number' />
      <CriteriaGridSimpleField width={4} label='Orientation' editor={ListSelector} propName='orientation' object={criteria} onObjectChanged={onCriteriaChanged} list={orientationFields} className={classes.selector} />

      <CriteriaGridSimpleField width={2} label='Vidéo' />
      <CriteriaGridSimpleField width={1} label='Durée (sec)' />
      <CriteriaGridSimpleField width={1} label='Min' editor={DebouncedTextField} propName='minDuration' object={criteria} onObjectChanged={onCriteriaChanged} type='number' />
      <CriteriaGridSimpleField width={1} label='Max' editor={DebouncedTextField} propName='maxDuration' object={criteria} onObjectChanged={onCriteriaChanged} type='number' />
      <mui.Grid item xs={7} />

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

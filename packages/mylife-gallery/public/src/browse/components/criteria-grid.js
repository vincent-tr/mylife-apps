'use strict';

import { React, PropTypes, mui, DateOrYearSelector, CriteriaField, DebouncedTextField, ListSelector } from 'mylife-tools-ui';
import TypeSelector from './type-selector';
import AlbumSelector from './album-selector';
import SortOrderSelector from './sort-order-selector';

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

const GridSimpleField = ({ object, onObjectChanged, propName, label, editor, width, ...props }) => {
  let editorNode = null;
  if(editor) {
    const EditorComponent = editor;
    const setValue = (value) => onObjectChanged({ [propName]: value });
    editorNode = (
      <EditorComponent value={object[propName]} onChange={setValue} {...props} />
    );
  }

  return (
    <mui.Grid item xs={width}>
      <CriteriaField label={label}>
        {editorNode}
      </CriteriaField>
    </mui.Grid>
  );
};

GridSimpleField.propTypes = {
  label: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  editor: PropTypes.elementType,
  object: PropTypes.object,
  onObjectChanged: PropTypes.func,
  propName: PropTypes.string
};

const useStyles = mui.makeStyles({
  selector: {
    minWidth: 160
  }
});

const CriteriaGrid = ({ criteria, onCriteriaChanged, display, onDisplayChanged }) => {
  const classes = useStyles();

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
      <GridSimpleField width={2} label='Date du document' />
      <GridSimpleField width={2} label='Début' editor={DateOrYearSelector} propName='minDate' object={criteria} onObjectChanged={onCriteriaChanged} showYearSelector />
      <GridSimpleField width={2} label='Fin' editor={DateOrYearSelector} propName='maxDate' object={criteria} onObjectChanged={onCriteriaChanged} showYearSelector selectLastDay />

      <GridSimpleField width={2} label={'Date d\'intégration'} />
      <GridSimpleField width={2} label='Début' editor={DateOrYearSelector} propName='minIntegrationDate' object={criteria} onObjectChanged={onCriteriaChanged} showYearSelector />
      <GridSimpleField width={2} label='Fin' editor={DateOrYearSelector} propName='maxIntegrationDate' object={criteria} onObjectChanged={onCriteriaChanged} showYearSelector selectLastDay />

      <GridSimpleField width={2} label='Type' editor={TypeSelector} propName='type' object={criteria} onObjectChanged={onCriteriaChanged} className={classes.selector} />
      <GridSimpleField width={4} label='Albums' editor={AlbumSelector} propName='albums' object={criteria} onObjectChanged={onCriteriaChanged} className={classes.selector} disabled={criteria.noAlbum} />
      <GridSimpleField width={1} label='Aucun' editor={WrappedCheckbox} propName='noAlbum' object={criteria} onObjectChanged={onNoAlbumCriteriaChanged} />
      <GridSimpleField width={4} label='Personnes (TODO)' /> {/* disabled={criteria.noPerson} */}
      <GridSimpleField width={1} label='Aucun' editor={WrappedCheckbox} propName='noPerson' object={criteria} onObjectChanged={onNoPersonCriteriaChanged} />

      <GridSimpleField width={3} label='Mots clés' editor={DebouncedTextField} propName='keywords' object={criteria} onObjectChanged={onCriteriaChanged} fullWidth />
      <GridSimpleField width={3} label='Légende' editor={DebouncedTextField} propName='caption' object={criteria} onObjectChanged={onCriteriaChanged} fullWidth />
      <GridSimpleField width={5} label='Chemin du fichier' editor={DebouncedTextField} propName='path' object={criteria} onObjectChanged={onCriteriaChanged} fullWidth />
      <GridSimpleField width={1} label='Doublons' editor={WrappedCheckbox} propName='pathDuplicate' object={criteria} onObjectChanged={onCriteriaChanged} />

      <GridSimpleField width={2} label='Image/Vidéo' />
      <GridSimpleField width={1} label='Largueur' />
      <GridSimpleField width={1} label='Min' editor={DebouncedTextField} propName='minWidth' object={criteria} onObjectChanged={onCriteriaChanged} type='number' />
      <GridSimpleField width={1} label='Max' editor={DebouncedTextField} propName='maxWidth' object={criteria} onObjectChanged={onCriteriaChanged} type='number' />
      <GridSimpleField width={1} label='Hauteur' />
      <GridSimpleField width={1} label='Min' editor={DebouncedTextField} propName='minHeight' object={criteria} onObjectChanged={onCriteriaChanged} type='number' />
      <GridSimpleField width={1} label='Max' editor={DebouncedTextField} propName='maxHeight' object={criteria} onObjectChanged={onCriteriaChanged} type='number' />
      <GridSimpleField width={4} label='Orientation' editor={ListSelector} propName='orientation' object={criteria} onObjectChanged={onCriteriaChanged} list={orientationFields} className={classes.selector} />

      <GridSimpleField width={2} label='Vidéo' />
      <GridSimpleField width={1} label='Durée (sec)' />
      <GridSimpleField width={1} label='Min' editor={DebouncedTextField} propName='minDuration' object={criteria} onObjectChanged={onCriteriaChanged} type='number' />
      <GridSimpleField width={1} label='Max' editor={DebouncedTextField} propName='maxDuration' object={criteria} onObjectChanged={onCriteriaChanged} type='number' />
      <mui.Grid item xs={7} />

      <GridSimpleField width={2} label='Tri' editor={ListSelector} propName='sortField' object={display} onObjectChanged={onDisplayChanged} list={sortFields} className={classes.selector} />
      <GridSimpleField width={3} label='' editor={SortOrderSelector} propName='sortOrder' object={display} onObjectChanged={onDisplayChanged} className={classes.selector} />
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

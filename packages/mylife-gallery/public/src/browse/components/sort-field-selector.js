import { React, PropTypes, mui } from 'mylife-tools-ui';

const fields = [
  { id: null, text: '<Aucun>' },
  { id: 'date', text: 'Date' },
  { id: 'integrationDate', text: 'Date d\'intégration' },
  { id: 'path', text: 'Chemin du fichier' }
];

const NULL_ID = 'null-id';

const SortFieldSelector = ({ value, onChange, ...props }) => {
  const handleChange = event => onChange(nullFromEditor(event.target.value));
  return (
    <mui.Select
      value={value || NULL_ID}
      onChange={handleChange}
      {...props}
    >
      {fields.map(field => (
        <mui.MenuItem key={field.id || NULL_ID} value={field.id || NULL_ID}>{field.text}</mui.MenuItem>
      ))}
    </mui.Select>
  );
};

SortFieldSelector.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired
};

export default SortFieldSelector;

function nullFromEditor(value) {
  if(value === NULL_ID) {
    return null;
  }

  return value;
}

import { React, PropTypes, mui, CriteriaField } from 'mylife-tools-ui';

interface CriteriaGridSimpleFieldProps {
  label: string;
  width: mui.GridSize;
  editor?: React.ElementType;
  object?;
  onObjectChanged?: (change) => void;
  propName?: string;

  // TODO: type it with editor props
  list?;
  fullWidth?;
  className?;
  showYearSelector?;
  disabled?;
  type?;
  selectLastDay?;
}

const CriteriaGridSimpleField: React.FunctionComponent<CriteriaGridSimpleFieldProps> = ({ object, onObjectChanged, propName, label, editor, width, ...props }) => {
  let editorNode: React.ReactChild = null;

  if (editor) {
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

CriteriaGridSimpleField.propTypes = {
  label: PropTypes.string.isRequired,
  width: PropTypes.any.isRequired, // number
  editor: PropTypes.any, // elementType
  object: PropTypes.object,
  onObjectChanged: PropTypes.func,
  propName: PropTypes.string
};

export default CriteriaGridSimpleField;

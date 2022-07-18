import { React, PropTypes, mui, CriteriaField } from 'mylife-tools-ui';

interface CriteriaGridSimpleFieldProps {
  label: string;
  width: number;
  editor?: React.ElementType;
  object?;
  onObjectChanged?: (change) => void;
  propName?: string;
}

const CriteriaGridSimpleField: React.FunctionComponent<CriteriaGridSimpleFieldProps> = ({ object, onObjectChanged, propName, label, editor, width, ...props }) => {
  let editorNode: React.ReactNode = null;
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

CriteriaGridSimpleField.propTypes = {
  label: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  editor: PropTypes.elementType,
  object: PropTypes.object,
  onObjectChanged: PropTypes.func,
  propName: PropTypes.string
};

export default CriteriaGridSimpleField;

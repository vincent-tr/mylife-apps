'use strict';

import { React, PropTypes, mui, CriteriaField } from 'mylife-tools-ui';

const CriteriaGridSimpleField = ({ object, onObjectChanged, propName, label, editor, width, ...props }) => {
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

CriteriaGridSimpleField.propTypes = {
  label: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  editor: PropTypes.elementType,
  object: PropTypes.object,
  onObjectChanged: PropTypes.func,
  propName: PropTypes.string
};

export default CriteriaGridSimpleField;

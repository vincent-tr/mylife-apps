'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import StringInput from './string-input';
import IntegerInput from './integer-input';

import './editor.scss';

const editors = {
  string: { def: 'input', displays: { input: StringInput } },
  integer: { def: 'input', displays: { input: IntegerInput } }, // as slider ?
  number: null, // decimals count, can be < 0 ?, +/- steps ?, as slider ?
  list: null,
  date: null,
  datetime: null,
  bool: null, // slider or checkbox ?
};

const Editor = React.forwardRef(({ type, display, ...props }, ref) => {
  const editor = editors[type];
  if(!editor) {
    throw new Error(`Bad editor type: '${type}'`);
  }
  const { displays, def } = editor;
  const EditorComponent = displays[display || def];
  if(!EditorComponent) {
    throw new Error(`Bad display type '${display}' for editor type: '${type}'`);
  }
  return (
    <EditorComponent ref={ref} {...props} />
  );
});

Editor.propTypes = {
  type: PropTypes.string.isRequired,
  display: PropTypes.string,
};

Editor.displayName = 'Editor';

export default Editor;

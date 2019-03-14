'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import StringTextbox from './string-textbox';
import IntegerTextbox from './integer-textbox';

import './editor.scss';

const editors = {
  string: { def: 'textbox', displays: { textbox: StringTextbox } },
  integer: { def: 'textbox', displays: { textbox: IntegerTextbox } }, // as slider ?
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

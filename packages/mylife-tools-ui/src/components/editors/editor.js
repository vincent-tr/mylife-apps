'use strict';

import React from 'react';
import PropTypes from 'prop-types';

import StringTextbox from './string-textbox';
import IntegerTextbox from './integer-textbox';
import IntegerSlider from './integer-slider';
import BooleanCheckbox from './boolean-checkbox';
import BooleanSlider from './boolean-slider';
import Listbox from './listbox';

import './editor.scss';

const editors = {
  string: { def: 'textbox', displays: { textbox: StringTextbox } }, // text area
  integer: { def: 'textbox', displays: { textbox: IntegerTextbox, slider: IntegerSlider } },
  number: null, // decimals count, can be < 0 ?, +/- steps ?, as slider ?
  list: { def: 'listbox', displays: { listbox: Listbox } },
  date: null,
  datetime: null,
  boolean: { def: 'checkbox', displays: { checkbox: BooleanCheckbox, slider: BooleanSlider } },
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

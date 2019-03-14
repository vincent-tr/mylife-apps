'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import String from './string';
import Integer from './integer';

import './editor.scss';

const editors = {
  string: String, // select text on focus
  integer: Integer, // as slider ? handle left/down arrow for +/-, select text on focus
  number: null, // decimals count, can be < 0 ?, +/- steps ?, as slider ?
  list: null,
  date: null,
  datetime: null,
  bool: null, // slider or checkbox ?
};

const Editor = React.forwardRef(({ type, ...props }, ref) => {
  const EditorComponent = editors[type];
  if(!EditorComponent) {
    throw new Error(`Bad editor type: '${type}'`);
  }
  return (
    <EditorComponent ref={ref} {...props} />
  );
});

Editor.propTypes = {
  type: PropTypes.string.isRequired
};

Editor.displayName = 'Editor';

export default Editor;

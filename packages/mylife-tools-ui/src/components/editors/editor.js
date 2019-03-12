'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import String from './string';

const editors = {
  string: String
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

'use strict';

import { React, PropTypes, mui } from 'mylife-tools-ui';

const ScriptGenerator = ({ documents, ...props}) => (
  <div {...props}>
    TODO
    {documents.length}
  </div>
);


ScriptGenerator.propTypes = {
  documents: PropTypes.array.isRequired,
};


export default ScriptGenerator;

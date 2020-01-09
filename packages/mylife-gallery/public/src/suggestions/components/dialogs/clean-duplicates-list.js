'use strict';

import { React, PropTypes, mui } from 'mylife-tools-ui';

const CleanDuplicatesList = ({ documents, selection, setSelection, ...props }) => {

  return (
    <div {...props} />
  );
};

CleanDuplicatesList.propTypes = {
  documents: PropTypes.array.isRequired,
  selection: PropTypes.object.isRequired,
  setSelection: PropTypes.func.isRequired
};

export default CleanDuplicatesList;

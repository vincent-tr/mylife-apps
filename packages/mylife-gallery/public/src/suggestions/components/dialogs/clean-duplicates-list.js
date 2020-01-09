'use strict';

import { React, PropTypes, mui, Virtuoso } from 'mylife-tools-ui';

const ListItemContent = ({ document, selection, setSelection }) => (
  <mui.ListItemText>
    {document.paths[0].path}
  </mui.ListItemText>
);

const CleanDuplicatesList = ({ documents, selection, setSelection, ...props }) => {

  return (
    <Virtuoso
      ListContainer={({ listRef, className, style, children }) => (
        <mui.List
          ref={listRef}
          style={{ margin: 0, padding: 0, ...style }}
          className={className}
        >
          {children}
        </mui.List>
      )}
      ItemContainer={({ children, ...props }) => (
        <mui.ListItem {...props} style={{ margin: 0 }}>
          {children}
        </mui.ListItem>
      )}
      totalCount={documents.length}
      item={index => (<ListItemContent document={documents[index]} selection={selection} setSelection={setSelection} />)}
      style={{ height: '100%', width: '100%', overflowX: 'hidden' }}
      {...props}
    />
  );
};

CleanDuplicatesList.propTypes = {
  documents: PropTypes.array.isRequired,
  selection: PropTypes.object.isRequired,
  setSelection: PropTypes.func.isRequired
};

export default CleanDuplicatesList;

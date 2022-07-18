'use strict';

import { React, PropTypes, mui, clsx, useSelectionSet, useScreenSize } from 'mylife-tools-ui';
import ListFooter from '../../common/list-footer';
import List from './list';
import Header from './header';

const useStyles = mui.makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  list: {
    flex: '1 1 auto'
  },
});

const DocumentList = ({ documents, className, selectedItems: externalSelectedItems, onSelectionChange: externalOnSelectionChange, ...props }) => {
  const classes = useStyles();
  const listSelectable = useSelectable();

  // provide internal selection management if not external
  const [internalSelectedItems, internalOnSelectionChange] = useSelectionSet(() => documents.map(doc => doc._id));
  const selectedItems = listSelectable ? (externalSelectedItems || internalSelectedItems) : null;
  const onSelectionChange = listSelectable ? (externalOnSelectionChange || internalOnSelectionChange) : null;

  return (
    <div className={clsx(classes.container, className)} {...props}>
      {listSelectable && (
        <Header documents={documents} selectedItems={selectedItems} onSelectionChange={onSelectionChange} />
      )}
      <List className={classes.list} data={documents} selectedItems={selectedItems} onSelectionChange={onSelectionChange}/>
      <ListFooter text={getFooterText(documents, selectedItems)} />
    </div>
  );
};

DocumentList.propTypes = {
  documents: PropTypes.array.isRequired,
  className: PropTypes.string,
  selectedItems: PropTypes.object,
  onSelectionChange: PropTypes.func
};

export default DocumentList;

function getFooterText(documents, selectedItems) {
  const base = `${documents.length} document(s)`;
  if(!selectedItems || selectedItems.size === 0) {
    return base;
  }
  return `${base} - ${selectedItems.size} sélectionné(s)`;
}

function useSelectable() {
  const screenSize = useScreenSize();

  switch(screenSize) {
    case 'phone':
    case 'tablet':
      return false;

    case 'laptop':
    case 'wide':
      return true;
  }
}

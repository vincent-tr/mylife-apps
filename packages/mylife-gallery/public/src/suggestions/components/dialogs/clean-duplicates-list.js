'use strict';

import { React, PropTypes, mui, Virtuoso } from 'mylife-tools-ui';

const ListItemContent = ({ document, selection, setSelection }) => {
  const paths = document.paths.map(fsItem => fsItem.path);
  const isChecked = (index) => selection.get(document._id) === index;
  const toogleChecked = (index) => {
    if(isChecked(index)) {
      setSelection(selection.delete(document._id));
    } else {
      setSelection(selection.set(document._id, index));
    }
  };

  return (
    <mui.ListItemText>
      <mui.FormGroup row>
        {paths.map((path, index) => (
          <mui.FormControlLabel key={index}
            control={
              <mui.Checkbox checked={isChecked(index)} onChange={() => toogleChecked(index)}  />
            }
            label={path}
          />
        ))}
      </mui.FormGroup>
    </mui.ListItemText>
  );
};

ListItemContent.propTypes = {
  document: PropTypes.object.isRequired,
  selection: PropTypes.object.isRequired,
  setSelection: PropTypes.func.isRequired
};

const CleanDuplicatesList = ({ documents, selection, setSelection, ...props }) => (
  <Virtuoso
    components={{
      List: React.forwardRef(({ className, style, children }, ref) => (
        <mui.List
          ref={ref}
          style={{ margin: 0, padding: 0, ...style }}
          className={className}
        >
          {children}
        </mui.List>
      )),
      Item: ({ children, ...props }) => (
        <mui.ListItem {...props} style={{ margin: 0 }}>
          {children}
        </mui.ListItem>
      )
    }}
    totalCount={documents.length}
    itemContent={index => (<ListItemContent document={documents[index]} selection={selection} setSelection={setSelection} />)}
    style={{ height: '100%', width: '100%', overflowX: 'hidden' }}
    {...props}
  />
);

CleanDuplicatesList.propTypes = {
  documents: PropTypes.array.isRequired,
  selection: PropTypes.object.isRequired,
  setSelection: PropTypes.func.isRequired
};

export default CleanDuplicatesList;

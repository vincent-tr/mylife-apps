'use strict';

import { React, PropTypes, mui, useMemo } from 'mylife-tools-ui';
import HeaderAlbums from './header-albums';
import HeaderPersons from './header-persons';
import HeaderKeywords from './header-keywords';

const useStyles = mui.makeStyles(theme => ({
  toolbar: {
    backgroundColor: mui.colors.grey[300],
  },
  separator: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    borderLeftWidth: 1,
    borderLeftStyle: 'solid',
    borderLeftColor: 'rgba(0, 0, 0, 0.3)',
    height: theme.spacing(4)
  }
}));

const Header = ({ documents, selectedItems, onSelectionChange }) => {
  const classes = useStyles();
  const selectedDocuments = useMemo(() => documents.filter(doc => selectedItems.has(doc._id)));

  const someSelected = selectedItems.size > 0;
  const allSelected = selectedItems.size === documents.length;
  const onAllChange = selected => onSelectionChange({ selected });

  if(!someSelected) {
    return null;
  }

  return (
    <mui.Toolbar className={classes.toolbar}>
      <mui.Checkbox checked={allSelected} indeterminate={someSelected && !allSelected} onChange={e => onAllChange(e.target.checked)} color='primary' />
      <div className={classes.separator} />
      <HeaderAlbums documents={selectedDocuments} />
      <div className={classes.separator} />
      <HeaderPersons documents={selectedDocuments} />
      <div className={classes.separator} />
      <mui.Typography>{'Mots clés'}</mui.Typography>
      <HeaderKeywords documents={selectedDocuments} />
    </mui.Toolbar>
  );
};

Header.propTypes = {
  documents: PropTypes.array.isRequired,
  selectedItems: PropTypes.object.isRequired,
  onSelectionChange: PropTypes.func.isRequired,
};

export default Header;

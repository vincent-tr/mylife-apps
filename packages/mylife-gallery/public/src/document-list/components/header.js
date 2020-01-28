'use strict';

import { React, PropTypes, mui, useMemo } from 'mylife-tools-ui';

/*

- Menu qui scroll avec
  - la liste des albums et le bouton delete a cote (ou add si avec genre 2/34 si 2 docs / 34 selectionnes ont l album)
  - un bouton add
    - sous menu avec la liste des albums ou nouveau
- en bas, bouton appliquer/annuler (pinned du scoll du menu)
- si on quitte le menu, c est annulé
*/

const useStyles = mui.makeStyles({
  toolbar: {
    backgroundColor: mui.colors.grey[300]
  }
});

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

      <mui.Typography>
        {'header'}
      </mui.Typography>
    </mui.Toolbar>
  );
};

Header.propTypes = {
  documents: PropTypes.array.isRequired,
  selectedItems: PropTypes.object.isRequired,
  onSelectionChange: PropTypes.func.isRequired,
};

export default Header;

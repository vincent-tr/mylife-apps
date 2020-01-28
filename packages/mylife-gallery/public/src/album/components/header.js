'use strict';

import { React, PropTypes, mui, immutable, useState, useMemo, useSelector, useDispatch, useLifecycle } from 'mylife-tools-ui';

const useStyles = mui.makeStyles({
  toolbar: {
    backgroundColor: mui.colors.grey[300]
  }
});

const Header = ({ totalCount, selectedItems, onSelectionChange }) => {
  const classes = useStyles();

  const someSelected = selectedItems.size > 0;
  const allSelected = selectedItems.size === totalCount;
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
  totalCount: PropTypes.number.isRequired,
  selectedItems: PropTypes.object.isRequired,
  onSelectionChange: PropTypes.func.isRequired,
};

export default Header;

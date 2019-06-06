'use strict';

import { React } from 'mylife-tools-ui';
import PropTypes from 'prop-types';
import { mui } from 'mylife-tools-ui';

import selectorDialog from './group-selector-dialog';

const GroupSelectorButton = React.forwardRef(({ onSelect, ...props }, ref) => {
  const clickHandler = async () => {
    const { result, group } = await selectorDialog();
    if(result !== 'ok') {
      return;
    }

    onSelect(group);
  };

  return (
    <mui.IconButton ref={ref} onClick={clickHandler} {...props}/>
  );
});

GroupSelectorButton.displayName = 'GroupSelectorButton';

GroupSelectorButton.propTypes = {
  onSelect : PropTypes.func.isRequired,
};

export default GroupSelectorButton;

'use strict';

import { React } from 'mylife-tools-ui';
import PropTypes from 'prop-types';
import { mui } from 'mylife-tools-ui';

import selectorDialog from './group-selector-dialog';

const GroupSelectorButton = React.forwardRef(({ onSelect, options, ...props }, ref) => {
  const clickHandler = async () => {
    const { result, group } = await selectorDialog({ options });
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
  options: PropTypes.object
};

export default GroupSelectorButton;

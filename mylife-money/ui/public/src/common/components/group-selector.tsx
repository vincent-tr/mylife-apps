import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import icons from '../icons';
import { getGroup } from '../../reference/selectors';

import GroupSelectorButton from './group-selector-button';
import Tooltip from '@mui/material/Tooltip';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';

type FIXME_any = any;

const useConnect = ({ value }) => {
  return useSelector((state) => ({
    stack: getStack(state, value),
  }));
};

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
});

const GroupPath = styled(Breadcrumbs)(({ theme }) => ({
  flex: '1 1 auto',
  marginLeft: theme.spacing(1),
  marginRight: theme.spacing(1),
}));

const GroupSelector = ({ onChange, value, ...props }) => {
  const { stack } = useConnect({ value });
  return (
    <Container {...props}>
      <Tooltip title="Sélectionner">
        <GroupSelectorButton onSelect={onChange}>
          <icons.actions.Move />
        </GroupSelectorButton>
      </Tooltip>
      <GroupPath aria-label="breadcrumb">
        {stack.map((node) => (
          <Typography key={node._id} color="textPrimary">
            {node.display}
          </Typography>
        ))}
      </GroupPath>
    </Container>
  );
};

GroupSelector.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default GroupSelector;

function getStack(state, value) {
  if (!value) {
    const group = getGroup(state, value);
    if (!group) {
      return []; // not loaded
    }
    return [group]; // non tries
  }

  const ret = [];
  while (value) {
    const group = getGroup(state, value);
    ret.push(group);
    value = (group as FIXME_any).parent;
  }

  ret.reverse();
  return ret;
}

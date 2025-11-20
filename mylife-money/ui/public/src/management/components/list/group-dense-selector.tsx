import React, { useMemo } from 'react';
import { Tooltip, Typography, styled } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import icons from '../../../common/icons';
import { getSelectedGroupId, selectGroup } from '../../store';
import { getGroup } from '../../../reference/selectors';
import GroupSelectorButton from '../../../common/components/group-selector-button';

type FIXME_any = any;

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center'
});

const Label = styled(Typography)(({ theme }) => ({
  flex: '1 1 auto',
  marginLeft: theme.spacing(1),
  marginRight: theme.spacing(1),
}));

const useConnect = () => {
  const dispatch = useDispatch<FIXME_any>();
  return {
    ...useSelector(state => ({
      selectedGroup : getGroup(state, { group: getSelectedGroupId(state) }),
    })),
    ...useMemo(() => ({
      onSelect : (id) => dispatch(selectGroup(id))
    }), [dispatch])
  };
};

interface GroupDenseSelectorProps {
  className?: string;
}

const GroupDenseSelector: React.FC<GroupDenseSelectorProps> = ({ className, ...props }) => {
  const { selectedGroup, onSelect } = useConnect();

  return (
    <Container className={className} {...props}>
      <Tooltip title={'Déplacer l\'opération'}>
        <div>
          <GroupSelectorButton onSelect={onSelect}>
            <icons.actions.Move />
          </GroupSelectorButton>
        </div>
      </Tooltip>
      <Label>
        {selectedGroup.display}
      </Label>
    </Container>
  );
};

export default GroupDenseSelector;

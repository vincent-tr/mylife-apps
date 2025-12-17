import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { styled } from '@mui/material/styles';
import React, { useState, useMemo } from 'react';
import { Group } from '../../api';
import { makeGetSortedChildren } from '../../reference/selectors';
import { useAppSelector } from '../../store-api';
import icons from '../icons';

const LevelListItem = styled(ListItem, {
  shouldForwardProp: (prop) => prop !== 'level',
})<{ level: number }>(({ theme, level }) => ({
  paddingLeft: theme.spacing(2 * (level + 1)),
}));

interface GroupNodeProps {
  level: number;
  group: Group; // Group object
  onSelect: (id: string) => void;
  selectedGroupId: string | null;
  disabledGroupIds?: string[];
  parentDisabled: boolean;
}

const GroupNode = ({ level, group, selectedGroupId, onSelect, disabledGroupIds, parentDisabled }: GroupNodeProps) => {
  const getSortedChildren = useMemo(makeGetSortedChildren, []);
  const [open, setOpen] = useState(true);
  const children = useAppSelector((state) => getSortedChildren(state, group._id));
  const selected = selectedGroupId === group._id;
  const disabled = parentDisabled || !!disabledGroupIds?.includes(group._id);
  const hasChildren = children.length > 0;

  return (
    <React.Fragment>
      <LevelListItem level={level}>
        <ListItemButton onClick={() => onSelect(group._id)} selected={selected} disabled={disabled}>
          <ListItemIcon>
            <icons.Group />
          </ListItemIcon>
          <ListItemText primary={group.display} />
          {hasChildren && (
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(!open);
              }}
            >
              {open ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          )}
        </ListItemButton>
      </LevelListItem>
      {hasChildren && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {children.map((child) => (
              <GroupNode
                key={child._id}
                group={child}
                level={level + 1}
                onSelect={onSelect}
                selectedGroupId={selectedGroupId}
                disabledGroupIds={disabledGroupIds}
                parentDisabled={disabled}
              />
            ))}
          </List>
        </Collapse>
      )}
    </React.Fragment>
  );
};

export default GroupNode;

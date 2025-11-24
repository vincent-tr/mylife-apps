import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import icons from '../icons';
import { makeGetSortedChildren } from '../../reference/selectors';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { ListItem, ListItemIcon, ListItemText, IconButton, Collapse, List, styled, ListItemButton } from '@mui/material';

type FIXME_any = any;

const emptyArray = [];

const useConnect = (groupId: string) => {
  const getSortedChildren = useMemo(makeGetSortedChildren, []);
  return {
    // 'Non triés' => no children
    children: groupId ? useSelector((state: FIXME_any) => getSortedChildren(state, groupId)) : emptyArray,
  };
};

const LevelListItem = styled(ListItem, {
  shouldForwardProp: (prop) => prop !== 'level',
})<{ level: number }>(({ theme, level }) => ({
  paddingLeft: theme.spacing(2 * (level + 1)),
}));

interface GroupNodeProps {
  level: number;
  group: FIXME_any; // Group object
  onSelect: (id: string) => void;
  selectedGroupId: string | null;
  disabledGroupIds?: string[];
  parentDisabled: boolean;
}

const GroupNode = ({ level, group, selectedGroupId, onSelect, disabledGroupIds, parentDisabled }: GroupNodeProps) => {
  const [open, setOpen] = useState(true);
  const { children } = useConnect(group._id);
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

import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import React from 'react';
import GroupSelector from '../../../common/components/group-selector';
import icons from '../../../common/icons';

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
});

const Header = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
});

const Label = styled(Typography)(({ theme }) => ({
  marginRight: theme.spacing(1),
}));

const Item = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
});

const GroupField = ({ groups, onGroupAdd, onGroupChanged, onGroupDelete }) => {
  return (
    <Container>
      <Header>
        <Label>Groupes</Label>
        <Tooltip title="Ajouter un groupe">
          <IconButton onClick={() => onGroupAdd()}>
            <icons.actions.New />
          </IconButton>
        </Tooltip>
      </Header>
      {groups.map((group, index) => (
        <Item key={index}>
          <GroupSelector value={group} onChange={(value) => onGroupChanged(index, value)} />
          <Tooltip title="Supprimer le groupe">
            <IconButton onClick={() => onGroupDelete(index)}>
              <icons.actions.Delete />
            </IconButton>
          </Tooltip>
        </Item>
      ))}
    </Container>
  );
};

GroupField.propTypes = {
  groups: PropTypes.object.isRequired,
  onGroupAdd: PropTypes.func.isRequired,
  onGroupChanged: PropTypes.func.isRequired,
  onGroupDelete: PropTypes.func.isRequired,
};

export default GroupField;

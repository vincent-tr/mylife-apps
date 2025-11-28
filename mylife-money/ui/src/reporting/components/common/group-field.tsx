import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import GroupSelector from '../../../common/components/group-selector';
import icons from '../../../common/icons';

type FIXME_any = any;

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

export interface GroupFieldProps {
  groups: FIXME_any;
  onGroupAdd: () => void;
  onGroupChanged: (index: number, value: FIXME_any) => void;
  onGroupDelete: (index: number) => void;
}

export default function GroupField({ groups, onGroupAdd, onGroupChanged, onGroupDelete }: GroupFieldProps) {
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
}

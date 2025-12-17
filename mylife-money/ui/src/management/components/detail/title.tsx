import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useCallback } from 'react';
import icons from '../../../common/icons';

const Container = styled('div')({
  display: 'flex',
  alignItems: 'center',
});

const Label = styled(Typography)(({ theme }) => ({
  marginLeft: theme.spacing(2),
}));

export interface TitleProps {
  onClose: () => void;
}

export default function Title({ onClose }: TitleProps) {
  const onClick = useCallback(() => {
    // Do not transmit the event to the action
    onClose();
  }, [onClose]);

  return (
    <Container>
      <Tooltip title="Retour">
        <div>
          <IconButton onClick={onClick}>
            <icons.actions.Back />
          </IconButton>
        </div>
      </Tooltip>

      <Label variant="h6">{"Detail de l'opération"}</Label>
    </Container>
  );
}

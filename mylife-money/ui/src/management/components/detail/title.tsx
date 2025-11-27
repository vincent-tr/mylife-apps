import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import React from 'react';
import icons from '../../../common/icons';

const Container = styled('div')({
  display: 'flex',
  alignItems: 'center',
});

const Label = styled(Typography)(({ theme }) => ({
  marginLeft: theme.spacing(2),
}));

interface TitleProps {
  onClose: () => void;
}

const Title: React.FC<TitleProps> = ({ onClose }) => {
  return (
    <Container>
      <Tooltip title="Retour">
        <div>
          <IconButton onClick={onClose}>
            <icons.actions.Back />
          </IconButton>
        </div>
      </Tooltip>

      <Label variant="h6">{"Detail de l'opération"}</Label>
    </Container>
  );
};

export default Title;

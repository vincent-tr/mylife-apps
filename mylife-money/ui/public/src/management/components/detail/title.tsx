import React from 'react';
import PropTypes from 'prop-types';
import icons from '../../../common/icons';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material';

const Container = styled('div')({
  display: 'flex',
  alignItems: 'center',
});

const Label = styled(Typography)(({ theme }) => ({
  marginLeft: theme.spacing(2),
}));

const Title = ({ onClose }) => {
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

Title.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default Title;

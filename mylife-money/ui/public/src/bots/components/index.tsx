import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import { ListContainer as ToolsListContainer } from 'mylife-tools';
import { useBots } from '../views';
import Detail from './detail';
import Run from './run';

type FIXME_any = any;
type Bot = FIXME_any;

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  flex: '1 1 auto',
});

const StyledList = styled(List)({
  display: 'flex',
  flexDirection: 'column',
  flex: '1 1 auto',
  width: 300,
  minWidth: 300,
});

const View = styled('div')({
  flex: '1 1 auto',
  display: 'flex',
  flexDirection: 'column',
});

const Title = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
}));

const TitleContent = styled('div')({
  flex: '1 1 auto',
  marginTop: 6,
  marginBottom: 6,
  display: 'flex',
  flexDirection: 'column',
});

const StyledRun = styled(Run)({
  flex: '1 1 auto',
});

const Bots: React.FC = () => {
  const { view } = useBots();
  const [selection, setSelection] = useState<string>(null);
  const bot = view[selection];

  return (
    <Container>
      <ToolsListContainer>
        <StyledList>
          {Object.values(view).map((bot: FIXME_any) => (
            <ListItem key={bot._id} disablePadding>
              <ListItemButton selected={selection === bot._id} onClick={() => setSelection(bot._id)}>
                <ListItemText primary={bot.type} />
              </ListItemButton>
            </ListItem>
          ))}
        </StyledList>
      </ToolsListContainer>

      <Divider orientation="vertical" />

      {bot && <BotView bot={bot} />}
    </Container>
  );
};

export default Bots;

const BotView: React.FC<{ bot: Bot }> = ({ bot }) => {
  return (
    <View>
      <Title>
        <TitleContent>
          <Typography align="center" variant="h6">
            {bot.type}
          </Typography>
        </TitleContent>
      </Title>

      <Detail bot={bot} />

      {bot.lastRun && (
        <>
          <Divider />

          <Title>
            <TitleContent>
              <Typography align="center" variant="body1">
                {'Dernière exécution'}
              </Typography>
            </TitleContent>
          </Title>

          <StyledRun run={bot.lastRun} />
        </>
      )}
    </View>
  );
};

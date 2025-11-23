import React, { useState } from 'react';
import { ListContainer as ToolsListContainer } from 'mylife-tools-ui';
import { useBots } from '../views';
import Detail from './detail';
import Run from './run';
import { styled, List, ListItem, ListItemButton, ListItemText, Divider, Typography } from '@mui/material';

type FIXME_any = any;
type Bot = FIXME_any;

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  flex: '1 1 auto',
});

const ListContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
});

const StyledListContainer = styled(ListContainer)({
  flex: '1 1 auto',
  width: 300,
  minWidth: 300,
});

const View = styled('div')({
  flex: '1 1 auto',
  display: 'flex',
  flexDirection: 'column'
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
        <StyledListContainer>
          <List>
            {Object.values(view).map((bot: FIXME_any) => (
              <ListItem key={bot._id} disablePadding>
                <ListItemButton 
                  selected={selection === bot._id} 
                  onClick={() => setSelection(bot._id)}
                >
                  <ListItemText primary={bot.displayName} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </StyledListContainer>
      </ToolsListContainer>

      <Divider orientation='vertical' />

      {bot && (
        <BotView bot={bot} />
      )}
    </Container>
  );
};

export default Bots;

const BotView: React.FC<{ bot: Bot; }> = ({ bot }) => {
  return (
    <View>

      <Title>
        <TitleContent>
          <Typography align='center' variant='h6'>{bot.type}</Typography>
        </TitleContent>
      </Title>

      <Detail bot={bot} />

      {bot.lastRun && (
        <>
          <Divider />

          <Title>
            <TitleContent>
              <Typography align='center' variant='body1'>{'Dernière exécution'}</Typography>
            </TitleContent>
          </Title>

          <StyledRun run={bot.lastRun} />
        </>
      )}
    </View>
  );
};

import React, { useCallback } from 'react';
import { CriteriaField, useAction, fireAsync } from 'mylife-tools-ui';
import icons from '../../common/icons';
import cronstrue from 'cronstrue';
import 'cronstrue/locales/fr';
import { startBot } from '../actions';
import { styled, Grid, IconButton, Link, TextField } from '@mui/material';

type FIXME_any = any;
type Bot = FIXME_any;

const Container = styled('div')(({ theme }) => ({
  overflowY: 'auto',
  padding: theme.spacing(1),
}));

const Detail: React.FC<{ bot: Bot; className?: string }> = ({ bot, className }) => {
  const start = useStart(bot._id);

  return (
    <Container className={className}>
      <Grid container spacing={2}>
        <Grid size={12}>
          <CronCriteriaField value={bot.schedule} />
        </Grid>
        <Grid size={12}>
          <CriteriaField label={'Lancer le robot'}>
            <IconButton onClick={start}>
              <icons.actions.Execute />
            </IconButton>
          </CriteriaField>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Detail;

const CronCriteriaField: React.FC<{ value: string }> = ({ value }) => {
  return (
    <CriteriaField
      label={
        <>
          {'Planification '}
          <Link href="https://github.com/node-cron/node-cron#cron-syntax" target="_blank" rel="noopener">
            "cron"
          </Link>
        </>
      }
    >
      {value ? <TextField InputProps={{ readOnly: true }} value={value} helperText={format(value)} /> : <TextField InputProps={{ readOnly: true }} value={'-'} helperText={' '} />}
    </CriteriaField>
  );
};

function format(value: string) {
  try {
    if (!value) {
      throw new Error('Empty value');
    }

    return cronstrue.toString(value, { locale: 'fr' });
  } catch (e) {
    return '<invalide>';
  }
}

function useStart(id: string) {
  const start = useAction(startBot);
  return useCallback(() => fireAsync(async () => start(id)), [id, start, fireAsync]);
}

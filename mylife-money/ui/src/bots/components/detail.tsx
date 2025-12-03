import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import cronstrue from 'cronstrue';
import 'cronstrue/locales/fr';
import { useCallback } from 'react';
import { CriteriaField, useAction, fireAsync } from 'mylife-tools';
import { Bot } from '../../api';
import icons from '../../common/icons';
import { startBot } from '../actions';

const Container = styled('div')(({ theme }) => ({
  overflowY: 'auto',
  padding: theme.spacing(1),
}));

export interface DetailProps {
  bot: Bot;
  className?: string;
}

export default function Detail({ bot, className }: DetailProps) {
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
}

interface CronCriteriaFieldProps {
  value: string;
}

function CronCriteriaField({ value }: CronCriteriaFieldProps) {
  return (
    <CriteriaField
      label={
        <>
          {'Planification '}
          <Link href="https://github.com/node-cron/node-cron#cron-syntax" target="_blank" rel="noopener">
            cron
          </Link>
        </>
      }
    >
      {value ? <TextField InputProps={{ readOnly: true }} value={value} helperText={format(value)} /> : <TextField InputProps={{ readOnly: true }} value={'-'} helperText={' '} />}
    </CriteriaField>
  );
}

function format(value: string) {
  try {
    if (!value) {
      throw new Error('Empty value');
    }

    return cronstrue.toString(value, { locale: 'fr' });
  } catch {
    return '<invalide>';
  }
}

function useStart(id: string) {
  const start = useAction(startBot);
  return useCallback(() => fireAsync(async () => start(id)), [id, start]);
}

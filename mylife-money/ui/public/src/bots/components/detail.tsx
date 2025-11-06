import React, { useCallback } from 'react';
import clsx from 'clsx';
import { CriteriaField, useAction, fireAsync } from 'mylife-tools-ui';
import icons from '../../common/icons';
import cronstrue from 'cronstrue';
import 'cronstrue/locales/fr';
import cronParser from 'cron-parser';
import { startBot } from '../actions';
import { makeStyles, Grid, IconButton, Link, TextField } from '@material-ui/core';

type FIXME_any = any;
type Bot = FIXME_any;

const useStyles = makeStyles(theme => ({
  container: {
    overflowY: 'auto',
    padding: theme.spacing(1),
  }
}));
const Detail: React.FunctionComponent<{ bot: Bot; className?: string; }> = ({ bot, className }) => {
  const classes = useStyles();
  const start = useStart(bot._id);

  return (
    <div className={clsx(classes.container, className)}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <CronCriteriaField value={bot.schedule} />
        </Grid>
        <Grid item xs={12}>
            <CriteriaField label={'Lancer le robot'}>
              <IconButton onClick={start}>
                <icons.actions.Execute />
              </IconButton>
            </CriteriaField>
        </Grid>
      </Grid>
    </div>
  );
};

export default Detail;

const CronCriteriaField: React.FunctionComponent<{ value: string; }> = ({ value }) => {

  return (
    <CriteriaField label={
      <>
        {'Planification '}
        <Link href="https://github.com/node-cron/node-cron#cron-syntax" target="_blank" rel="noopener">
          "cron"
        </Link>
      </>
    }>
      { value ? (
        <TextField InputProps={{ readOnly: true }} value={value} helperText={format(value)} />
      ) : (
        <TextField InputProps={{ readOnly: true }} value={'-'} helperText={' '} />
      )}
    </CriteriaField>
  );
};

export function validate(value: string) {
  if (!value) {
    return false;
  }
  
  try { 
    cronParser.parseExpression(value);
    cronstrue.toString(value);
    return true;
  } catch(e) {
    return false;
  }
}

export function format(value: string) {
  if (!validate(value)) {
    return '<invalide>';
  }

  return cronstrue.toString(value, { locale: 'fr' });
}

function useStart(id: string) {
  const start = useAction(startBot);
  return useCallback(() => fireAsync(async () => start(id)), [id, start, fireAsync]);
}
import React, { useCallback, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { dialogs, useAction, fireAsync } from 'mylife-tools-ui';
import { getState } from '../selectors';
import { setParameters } from '../actions';
import { TeslaState } from '../../../../shared/metadata';
import { makeStyles, Dialog, DialogTitle, DialogContent, Grid, Typography, TextField, DialogActions, Button } from '@material-ui/core';

interface Parameters {
	fastLimit: number; // Fast mode charge limit (%)
	smartLimitLow: number; // Smart mode charge low limit (%)
	smartLimitHigh: number; // Smart mode charge high limit (%)
	smartFastCurrent: number; // Smart mode fast charge current (A)
}

type ProceedCallback = (arg: { result: 'ok' | 'cancel', parameters?: Parameters }) => void;

const useStyles = makeStyles(theme => ({
  parameterTitle: {
    marginLeft: theme.spacing(2),
  },
}));

const ParametersDialog: React.FunctionComponent<{ show: boolean; proceed: ProceedCallback; parameters: Parameters; }> = ({ show, proceed, parameters }) => {
  const classes = useStyles();
  const [values, setValues] = useState(parameters);
  useEffect(() => setValues(parameters), [parameters]);

  const update = useCallback((newValues: Partial<Parameters>) => {
    setValues(values => ({...values, ...newValues}));
  }, [setValues]);

  return (
    <Dialog aria-labelledby='dialog-title' open={show}>
      <DialogTitle id='dialog-title'>{`Paramètres`}</DialogTitle>

      <DialogContent dividers>
          <Grid container spacing={2}>

            <>
              <Grid item xs={12}>
                <Typography variant='h6'>{'Mode rapide'}</Typography>
              </Grid>

              <>
                <Grid item xs={6}>
                  <Typography className={classes.parameterTitle}>{'Limite de charge (%)'}</Typography>
                </Grid>

                <Grid item xs={6}>
                  <TextField value={values.fastLimit || '0'} onChange={e => update({ fastLimit: safeParseInt(e.target.value) })} />
                </Grid>
              </>
            </>

            <>
              <Grid item xs={12}>
                <Typography variant='h6'>{'Mode intelligent'}</Typography>
              </Grid>

              <>
                <Grid item xs={6}>
                  <Typography className={classes.parameterTitle}>{'Limite de charge rapide (%)'}</Typography>
                </Grid>

                <Grid item xs={6}>
                  <TextField value={values.smartLimitLow || '0'} onChange={e => update({ smartLimitLow: safeParseInt(e.target.value) })} />
                </Grid>
              </>

              <>
                <Grid item xs={6}>
                  <Typography className={classes.parameterTitle}>{'Limite de charge complète (%)'}</Typography>
                </Grid>

                <Grid item xs={6}>
                  <TextField value={values.smartLimitHigh || '0'} onChange={e => update({ smartLimitHigh: safeParseInt(e.target.value) })} />
                </Grid>
              </>

              <>
                <Grid item xs={6}>
                  <Typography className={classes.parameterTitle}>{'Courant de charge rapide (A)'}</Typography>
                </Grid>

                <Grid item xs={6}>
                  <TextField value={values.smartFastCurrent || '0'} onChange={e => update({ smartFastCurrent: safeParseInt(e.target.value) })} />
                </Grid>
              </>
            </>

          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => proceed({ result: 'ok', parameters: values })} color='primary'>OK</Button>
          <Button onClick={() => proceed({ result: 'cancel' })}>Annuler</Button>
        </DialogActions>
    </Dialog>
  );
};

const parametersDialog = dialogs.create(ParametersDialog);

export function useParameters() {
  const state = useSelector(state => getState(state));
  const set = useAction(setParameters);

  // if 'bot = null' then create
  return useCallback(() => fireAsync(async() => {
    const { result, parameters } = await parametersDialog({ parameters: buildParameters(state) });
    if (result !== 'ok') {
      return;
    }

    await set(parameters);
  }), [setParameters, state]);
}

function buildParameters(state: TeslaState): Parameters {
  const {	fastLimit, smartLimitLow, smartLimitHigh, smartFastCurrent } = state;
  return {	fastLimit, smartLimitLow, smartLimitHigh, smartFastCurrent };
}

function safeParseInt(value: string) {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? 0 : parsed;
}

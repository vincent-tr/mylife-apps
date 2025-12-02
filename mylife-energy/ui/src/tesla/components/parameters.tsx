import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useCallback, useState, useEffect } from 'react';
import { dialogs, useAction, fireAsync } from 'mylife-tools';
import { TeslaState } from '../../api';
import { useAppSelector } from '../../store';
import { setParameters } from '../actions';
import { getTeslaState } from '../views';

type FIXME_any = any;

interface Parameters {
  fastLimit: number; // Fast mode charge limit (%)
  smartLimitLow: number; // Smart mode charge low limit (%)
  smartLimitHigh: number; // Smart mode charge high limit (%)
  smartFastCurrent: number; // Smart mode fast charge current (A)
}

type ProceedCallback = (arg: { result: 'ok' | 'cancel'; parameters?: Parameters }) => void;

const ParameterTitle = styled(Typography)(({ theme }) => ({
  marginLeft: theme.spacing(2),
}));

interface ParametersDialogProps {
  show: boolean;
  proceed: ProceedCallback;
  parameters: Parameters;
}

function ParametersDialog({ show, proceed, parameters }: ParametersDialogProps) {
  const [values, setValues] = useState(parameters);
  useEffect(() => setValues(parameters), [parameters]);

  const update = useCallback(
    (newValues: Partial<Parameters>) => {
      setValues((values) => ({ ...values, ...newValues }));
    },
    [setValues]
  );

  return (
    <Dialog aria-labelledby="dialog-title" open={show}>
      <DialogTitle id="dialog-title">{`Paramètres`}</DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={2}>
          <>
            <Grid size={12}>
              <Typography variant="h6">{'Mode rapide'}</Typography>
            </Grid>

            <>
              <Grid size={6}>
                <ParameterTitle>{'Limite de charge (%)'}</ParameterTitle>
              </Grid>

              <Grid size={6}>
                <TextField value={values.fastLimit || '0'} onChange={(e) => update({ fastLimit: safeParseInt(e.target.value) })} />
              </Grid>
            </>
          </>

          <>
            <Grid size={12}>
              <Typography variant="h6">{'Mode intelligent'}</Typography>
            </Grid>

            <>
              <Grid size={6}>
                <ParameterTitle>{'Limite de charge rapide (%)'}</ParameterTitle>
              </Grid>

              <Grid size={6}>
                <TextField value={values.smartLimitLow || '0'} onChange={(e) => update({ smartLimitLow: safeParseInt(e.target.value) })} />
              </Grid>
            </>

            <>
              <Grid size={6}>
                <ParameterTitle>{'Limite de charge complète (%)'}</ParameterTitle>
              </Grid>

              <Grid size={6}>
                <TextField value={values.smartLimitHigh || '0'} onChange={(e) => update({ smartLimitHigh: safeParseInt(e.target.value) })} />
              </Grid>
            </>

            <>
              <Grid size={6}>
                <ParameterTitle>{'Courant de charge rapide (A)'}</ParameterTitle>
              </Grid>

              <Grid size={6}>
                <TextField value={values.smartFastCurrent || '0'} onChange={(e) => update({ smartFastCurrent: safeParseInt(e.target.value) })} />
              </Grid>
            </>
          </>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={() => proceed({ result: 'ok', parameters: values })} color="primary">
          OK
        </Button>
        <Button onClick={() => proceed({ result: 'cancel' })}>Annuler</Button>
      </DialogActions>
    </Dialog>
  );
}

const parametersDialog = dialogs.create(ParametersDialog);

export function useParameters() {
  const state = useAppSelector(getTeslaState);
  const set = useAction(setParameters);

  // if 'bot = null' then create
  return useCallback(
    () =>
      fireAsync(async () => {
        const { result, parameters } = (await parametersDialog({ parameters: buildParameters(state) })) as FIXME_any;
        if (result !== 'ok') {
          return;
        }

        await set(parameters);
      }),
    [set, state]
  );
}

function buildParameters(state: TeslaState): Parameters {
  const { fastLimit, smartLimitLow, smartLimitHigh, smartFastCurrent } = state;
  return { fastLimit, smartLimitLow, smartLimitHigh, smartFastCurrent };
}

function safeParseInt(value: string) {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? 0 : parsed;
}

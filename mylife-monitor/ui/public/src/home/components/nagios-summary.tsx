'use strict';

import React from 'react';
import { mui, clsx } from 'mylife-tools-ui';
import icons from '../../common/icons';
import { useStatusColorStyles } from '../../common/status-colors';

const useStyles = mui.makeStyles(theme => ({
  container: {
    display: 'inline-block',
    width: 300,
    margin: theme.spacing(4)
  },
  headerCell: {
    display: 'flex',
    '& > *': {
      marginRight: theme.spacing(2)
    },
  },
  column: {
  }
}));

const TYPE_DISPLAY = {
  host: 'Hôtes',
  service: 'Services'
};

const NagiosSummary = ({ data }) => {
  const classes = { ...useStatusColorStyles(), ...useStyles() };
  return (
    <mui.TableContainer component={mui.Paper} className={classes.container}>
      <mui.Table size='small'>
        <mui.TableHead>
          <mui.TableRow>
            <mui.TableCell colSpan={3}>
              <div className={classes.headerCell}>
                <icons.menu.Nagios />
                {TYPE_DISPLAY[data.type]}
              </div>
            </mui.TableCell>
          </mui.TableRow>
          <mui.TableRow>
            <mui.TableCell className={classes.column}>{'OK'}</mui.TableCell>
            <mui.TableCell className={classes.column}>{'Warnings'}</mui.TableCell>
            <mui.TableCell className={classes.column}>{'Errors'}</mui.TableCell>
          </mui.TableRow>
        </mui.TableHead>

        <mui.TableBody>
          <mui.TableRow>
            <mui.TableCell className={clsx(classes.column, classes.success)}>{data.ok.toString()}</mui.TableCell>
            <mui.TableCell className={clsx(classes.column, classes.warning)}>{data.warnings.toString()}</mui.TableCell>
            <mui.TableCell className={clsx(classes.column, classes.error)}>{data.errors.toString()}</mui.TableCell>
          </mui.TableRow>
        </mui.TableBody>
      </mui.Table>
    </mui.TableContainer>
  );
};

export default NagiosSummary;

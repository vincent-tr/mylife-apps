'use strict';

import humanizeDuration from 'humanize-duration';
import React from 'react';
import { mui, clsx } from 'mylife-tools-ui';
import icons from '../../common/icons';
import { useStatusColorStyles } from '../../common/status-colors';

const useStyles = mui.makeStyles(theme => ({
  container: {
    display: 'inline-block',
    width: 400,
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

const UpdatesSummary = ({ view }) => {
  const classes = useStyles();

  return (
    <mui.TableContainer component={mui.Paper} className={classes.container}>
      <mui.Table size='small'>
        <mui.TableHead>
          <mui.TableRow>
            <mui.TableCell colSpan={3}>
              <div className={classes.headerCell}>
                <icons.menu.Updates />
                {'Updates'}
              </div>
            </mui.TableCell>
          </mui.TableRow>
          <mui.TableRow>
            <mui.TableCell className={classes.column}>{'Catégorie'}</mui.TableCell>
            <mui.TableCell className={classes.column}>{'OK'}</mui.TableCell>
            <mui.TableCell className={classes.column}>{'Dépassés'}</mui.TableCell>
            <mui.TableCell className={classes.column}>{'Inconnus'}</mui.TableCell>
          </mui.TableRow>
        </mui.TableHead>

        <mui.TableBody>
          {view.valueSeq().map(data => (
            <Row key={data._id} data={data} />
          ))}
        </mui.TableBody>
      </mui.Table>
    </mui.TableContainer>
  );
};

export default UpdatesSummary;

const Row = ({ data }) => {
  const classes = { ...useStatusColorStyles(), ...useStyles() };

  return (
    <mui.TableRow>
      <mui.TableCell className={clsx(classes.column)}>{data.category}</mui.TableCell>
      <mui.TableCell className={clsx(classes.column, classes.success)}>{data.ok}</mui.TableCell>
      <mui.TableCell className={clsx(classes.column, classes.warning)}>{data.outdated}</mui.TableCell>
      <mui.TableCell className={clsx(classes.column, classes.error)}>{data.unknown}</mui.TableCell>
    </mui.TableRow>
  );
}

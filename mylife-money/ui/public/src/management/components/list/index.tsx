import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

import Header from './header';
import Footer from './footer';
import Table from './table';
import { Paper, Divider, makeStyles } from '@mui/material';

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  table: {
    flex: '1 1 auto',
  }
});

const ListContainer = ({ className }) => {
  const classes = useStyles();

  return (
    <Paper className={clsx(classes.container, className)}>
      <Header />
      <Table className={classes.table}/>
      <Divider />
      <Footer />
    </Paper>
  );
};

ListContainer.propTypes = {
  className: PropTypes.string
};

export default ListContainer;

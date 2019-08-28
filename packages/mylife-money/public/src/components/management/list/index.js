'use strict';

import { React, mui, PropTypes, clsx } from 'mylife-tools-ui';

import Header from './header';
import Footer from './footer';
import Table from './table';

const { makeStyles } = mui;

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
    <mui.Paper className={clsx(classes.container, className)}>
      <Header />
      <Table className={classes.table}/>
      <mui.Divider />
      <Footer />
    </mui.Paper>
  );
};

ListContainer.propTypes = {
  className: PropTypes.string
};

export default ListContainer;

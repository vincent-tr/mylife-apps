import { React, mui } from 'mylife-tools-ui';

const useStyles = mui.makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 auto',
    overflowY: 'auto'
  }
});

const Bots: React.FunctionComponent = () => {
  const classes = useStyles();

  return <div>BOTS</div>;
};

export default Bots;

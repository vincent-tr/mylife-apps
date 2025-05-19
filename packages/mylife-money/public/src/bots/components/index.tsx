import { React, mui, useState, ListContainer } from 'mylife-tools-ui';
import { useBots } from '../views';
import Detail from './detail';
import Run from './run';

type FIXME_any = any;
type Bot = FIXME_any;

const useStyles = mui.makeStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'row',
    flex: '1 1 auto',
  },
  listContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  list: {
    flex: '1 1 auto',
    width: 300,
    minWidth: 300,
  },
  addButton: {
    alignSelf: 'center',
    color: theme.palette.success.main
  },
  view: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column'
  },
  title: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
  titleContent: {
    flex: '1 1 auto',
    marginTop: 6,
    marginBottom: 6,
    display: 'flex',
    flexDirection: 'column',
  },
  detail: {
  },
  run: {
    flex: '1 1 auto',
  }
}));

const Bots: React.FunctionComponent = () => {
  const classes = useStyles();
  const { view } = useBots();
  const [selection, setSelection] = useState<string>(null);
  const bot = view.get(selection);

  return (
    <div className={classes.container}>
      <div className={classes.listContainer}>
        <ListContainer className={classes.list}>
          <mui.List>
            {view.valueSeq().map(bot => (
              <mui.ListItem key={bot._id} selected={selection === bot._id} button onClick={() => setSelection(bot._id)}>
                <mui.ListItemText primary={bot.type} />
              </mui.ListItem>
            ))}
          </mui.List>
        </ListContainer>
      </div>

      <mui.Divider orientation='vertical' />

      {bot && (
        <BotView bot={bot} />
      )}
    </div>
  );
};

export default Bots;

const BotView: React.FunctionComponent<{ bot: Bot; }> = ({ bot }) => {
  const classes = useStyles();

  return (
    <div className={classes.view}>

      <div className={classes.title}>
        <div className={classes.titleContent}>
          <mui.Typography align='center' variant='h6'>{bot.type}</mui.Typography>
        </div>
      </div>

      <Detail bot={bot} className={classes.detail} />

      {bot.lastRun && (
        <>
          <mui.Divider />

          <div className={classes.title}>
            <div className={classes.titleContent}>
              <mui.Typography align='center' variant='body1'>{'Dernière exécution'}</mui.Typography>
            </div>
          </div>

          <Run run={bot.lastRun} className={classes.run} />
        </>
      )}
    </div>
  );
};

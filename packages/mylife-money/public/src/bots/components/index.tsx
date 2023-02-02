import { React, mui, useState, DeleteButton } from 'mylife-tools-ui';
import { useBots } from '../views';
import icons from '../../common/icons';
import Detail from './detail';
import Runs from './runs';

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
    borderRightWidth: 1,
    borderRightColor: mui.colors.grey[300],
    borderRightStyle: 'solid',
  },
  list: {
    flex: '1 1 auto',
    overflowY: 'auto',
    width: 300,
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
  content: {
    flex: '1 1 auto',
    overflowY: 'auto',
    padding: theme.spacing(1),
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
        <mui.List className={classes.list}>
          {view.valueSeq().map(bot => (
            <mui.ListItem key={bot._id} selected={selection === bot._id} button onClick={() => setSelection(bot._id)}>
              <mui.ListItemText primary={bot.name} secondary={bot.type} />
            </mui.ListItem>
          ))}
        </mui.List>

        <mui.Tooltip title='Créer un robot'>
          <mui.IconButton className={classes.addButton} onClick={() => console.log('create')}>
            <icons.actions.New />
          </mui.IconButton>
        </mui.Tooltip>
      </div>

      {bot && (
        <BotView bot={bot} />
      )}
    </div>
  );
};

export default Bots;

const BotView: React.FunctionComponent<{ bot: Bot }> = ({ bot }) => {
  const classes = useStyles();
  type SelectedTab = 'detail' | 'execution';
  const [value, setValue] = useState('detail' as SelectedTab);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: SelectedTab) => {
    setValue(newValue);
  };

  return (
    <div className={classes.view}>

      <div className={classes.title}>
        <div className={classes.titleContent}>
          <mui.Typography align='center' variant='body1'>{bot.name}</mui.Typography>
          <mui.Typography align='center' variant='body2' color='textSecondary'>{bot.type}</mui.Typography>
        </div>

        <mui.Tooltip title='Modifier le robot'>
          <mui.IconButton onClick={() => console.log('update')}>
            <icons.actions.Edit />
          </mui.IconButton>
        </mui.Tooltip>

        <DeleteButton icon tooltip="Supprimer le robot" onConfirmed={() => console.log('delete')} />
      </div>

      <mui.Tabs
        value={value}
        indicatorColor='primary'
        textColor='primary'
        onChange={handleChange}
      >
        <mui.Tab label='Détails' value='detail' />
        <mui.Tab label='Exécution' value='execution' />
      </mui.Tabs>

      <div className={classes.content}>
        {value === 'detail' && (
          <Detail bot={bot} />
        )}

        {value === 'execution' && (
          <Runs id={bot._id} />
        )}
      </div>

    </div>
  );
};

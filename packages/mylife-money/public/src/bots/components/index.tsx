import { React, mui, useState, useCallback, DeleteButton, ListContainer, fireAsync, useAction } from 'mylife-tools-ui';
import { useBots } from '../views';
import { createBot, updateBot, deleteBot } from '../actions';
import icons from '../../common/icons';
import Detail from './detail';
import Runs from './runs';
import updateDialog from './update';

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
  }
}));

const Bots: React.FunctionComponent = () => {
  const classes = useStyles();
  const { view } = useBots();
  const [selection, setSelection] = useState<string>(null);
  const bot = view.get(selection);
  const delBot = useAction(deleteBot);
  const upBot = useUpdate(setSelection);

  // Note: not the best optim way...
  const createOnDelete = (bot: Bot) => () => {
    delBot(bot._id);
    setSelection(null);
  };

  const createOnUpdate = (bot: Bot) => () => {
    upBot(bot);
  };

  const onCreate = () => {
    const id = upBot(null);
  };

  return (
    <div className={classes.container}>
      <div className={classes.listContainer}>
        <ListContainer className={classes.list}>
          <mui.List>
            {view.valueSeq().map(bot => (
              <mui.ListItem key={bot._id} selected={selection === bot._id} button onClick={() => setSelection(bot._id)}>
                <mui.ListItemText primary={bot.name} secondary={bot.type} />
              </mui.ListItem>
            ))}
          </mui.List>
        </ListContainer>

        <mui.Tooltip title='Créer un robot'>
          <mui.IconButton className={classes.addButton} onClick={onCreate}>
            <icons.actions.New />
          </mui.IconButton>
        </mui.Tooltip>
      </div>

      <mui.Divider orientation='vertical' />

      {bot && (
        <BotView bot={bot} onUpdate={createOnUpdate(bot)} onDelete={createOnDelete(bot)} />
      )}
    </div>
  );
};

export default Bots;

const BotView: React.FunctionComponent<{ bot: Bot; onUpdate: () => void; onDelete: () => void; }> = ({ bot, onUpdate, onDelete }) => {
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
          <mui.IconButton onClick={onUpdate}>
            <icons.actions.Edit />
          </mui.IconButton>
        </mui.Tooltip>

        <DeleteButton icon tooltip="Supprimer le robot" onConfirmed={onDelete} />
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

      {value === 'detail' && (
        <Detail bot={bot} className={classes.content} />
      )}

      {value === 'execution' && (
        <Runs bot={bot} className={classes.content}/>
      )}

    </div>
  );
};

function useUpdate(setSelection: (id: string) => void) {
  const create = useAction(createBot) as unknown as ((bot: Bot) => Promise<string>); // FIXME: type better async dispatcher
  const update = useAction(updateBot);

  // if 'bot = null' then create
  return useCallback((bot: Bot) => fireAsync(async() => {
    const { result, values } = await updateDialog({ options: { bot } });
    if(result !== 'ok') {
      return;
    }

    if (bot) {
      await update({ ...values, _id: bot._id });
    } else {
      const id = await create(values);
      setSelection(id);
    }
  }), [create, update, setSelection]);
}

import { React, mui, dialogs, useDispatch, useSelector, useMemo } from 'mylife-tools-ui';
import { createSlideshow } from '../actions';
import { getDisplayView } from '../selectors';
import ListItem from './list-item';

type FIXME_any = any;

const useStyles = mui.makeStyles(theme => ({
  addButton: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  }
}));

const useConnect = () => {
  const dispatch = useDispatch<FIXME_any>();
  return {
    ...useSelector(state => ({
      data: getDisplayView(state),
    })),
    ...useMemo(() => ({
      createSlideshow: name => dispatch(createSlideshow(name)),
    }), [dispatch])
  };
};

const List = ({ ...props }) => {
  const classes = useStyles();
  const { data, createSlideshow } = useConnect();

  const onAdd = async () => {
    const { result, text: name } = await dialogs.input({ title: 'Nom du nouveau diaporama', label: 'Nom' });
    if(result !== 'ok') {
      return;
    }

    createSlideshow(name);
  };

  return (
    <>
      <mui.List {...props}>
        {data.map(slideshow => (
          <ListItem key={slideshow._id} slideshow={slideshow} />
        ))}
      </mui.List>
      <mui.Tooltip title='Nouveau diaporama'>
        <mui.Fab color='primary' className={classes.addButton} onClick={onAdd}>
          <mui.icons.Add />
        </mui.Fab>
      </mui.Tooltip>
    </>
  );
};

export default List;

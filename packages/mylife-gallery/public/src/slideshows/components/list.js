'use strict';

import { React, mui, dialogs, useDispatch, useSelector, useMemo } from 'mylife-tools-ui';
import { createSlideshow, deleteSlideshow, changeSelected } from '../actions';
import { getDisplayView, getSelectedId } from '../selectors';
import ListItem from './list-item';

const useStyles = mui.makeStyles(theme => ({
  addButton: {
    position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  }
}));

const useConnect = () => {
  const dispatch = useDispatch();
  return {
    ...useSelector(state => ({
      data: getDisplayView(state),
      selectedId: getSelectedId(state),
    })),
    ...useMemo(() => ({
      createSlideshow: name => dispatch(createSlideshow(name)),
      deleteSlideshow: id => dispatch(deleteSlideshow(id)),
      changeSelected: id => dispatch(changeSelected(id))
    }), [dispatch])
  };
};

const List = ({ ...props }) => {
  const classes = useStyles();
  const { data, selectedId, createSlideshow, deleteSlideshow, changeSelected } = useConnect();

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
        {data.map(slideshow => {
          const id = slideshow._id;
          const selected = selectedId === id;
          const toggleSelect = () => changeSelected(selectedId === id ? null : id);
          const onDelete = () => deleteSlideshow(id);
          return (
            <ListItem
              key={id}
              slideshow={slideshow}
              selected={selected}
              toggleSelect={toggleSelect}
              onDelete={onDelete}
            />
          );
        })}
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

'use strict';

import { React, PropTypes, mui, useDispatch, useSelector, useMemo } from 'mylife-tools-ui';
import { changeSelected } from '../actions';
import { getSelectedId } from '../selectors';
import ItemHeader from './item-header';
import ItemDetail from './item-detail';

const useStyles = mui.makeStyles({
  panel: {
    width: '100%',
  }
});

const useConnect = () => {
  const dispatch = useDispatch();
  return {
    ...useSelector(state => ({
      selectedId: getSelectedId(state),
    })),
    ...useMemo(() => ({
      changeSelected: id => dispatch(changeSelected(id)),
    }), [dispatch])
  };
};

const ListItem = ({ slideshow, ...props }) => {
  const classes = useStyles();
  const { selectedId, changeSelected } = useConnect();
  const id = slideshow._id;
  const selected = selectedId === id;
  const toggleSelect = () => changeSelected(selectedId === id ? null : id);

  return (
    <mui.ListItem {...props}>
      <mui.ExpansionPanel expanded={selected} onChange={toggleSelect} className={classes.panel}>
        <ItemHeader slideshow={slideshow} />
        <ItemDetail slideshow={slideshow} />
      </mui.ExpansionPanel>
    </mui.ListItem>
  );
};

ListItem.propTypes = {
  slideshow: PropTypes.object.isRequired
};

export default ListItem;

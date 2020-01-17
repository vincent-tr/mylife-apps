'use strict';

import { React, PropTypes, mui, dialogs, useDispatch, useSelector, useMemo } from 'mylife-tools-ui';
import ThumbnailList from '../../common/thumbnail-list';
import { createSlideshow, changeSelected } from '../actions';
import { getDisplayView, getSelectedId } from '../selectors';
import icons from '../../common/icons';

const useStyles = mui.makeStyles(theme => ({
  deleteButton: {
    color: theme.status.error
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
      changeSelected: id => dispatch(changeSelected(id))
    }), [dispatch])
  };
};

const ListItem = ({ slideshow, selected, toggleSelect, onDelete, ...props }) => {
  const classes = useStyles();
  // const { data, selectedId, createSlideshow, changeSelected } = useConnect();

  return (
    <mui.ListItem {...props}>
      <mui.ExpansionPanel expanded={selected} onChange={toggleSelect}>
        <mui.ExpansionPanelSummary
          expandIcon={<mui.icons.ExpandMore />}>
          <mui.Typography>{slideshow.name}</mui.Typography>
        </mui.ExpansionPanelSummary>
        <mui.ExpansionPanelDetails>
          {slideshow.style}
          <mui.Button>
            fullscreen
          </mui.Button>
          {/* thumbnail du diaporama */}
          {/* selection des albums */}
          {/* bouton suppression */}
          <mui.IconButton onClick={onDelete} className={classes.deleteButton}>
            <icons.actions.Delete />
          </mui.IconButton>
        </mui.ExpansionPanelDetails>
      </mui.ExpansionPanel>
    </mui.ListItem>
  );
};

ListItem.propTypes = {
  slideshow: PropTypes.object.isRequired,
  selected: PropTypes.bool.isRequired,
  toggleSelect: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default ListItem;

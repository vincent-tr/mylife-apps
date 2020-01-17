'use strict';

import { React, PropTypes, mui, useDispatch, useSelector, useMemo, StopPropagationContainer, DebouncedTextField, ListSelector } from 'mylife-tools-ui';
import ThumbnailList from '../../common/thumbnail-list';
import { deleteSlideshow, updateSlideshow, changeSelected } from '../actions';
import { getDisplayView, getSelectedId } from '../selectors';
import icons from '../../common/icons';

const useStyles = mui.makeStyles(theme => ({
  panel: {
    width: '100%',
  },
  summaryContainer: {
    display: 'flex',
    alignItems: 'center',
    '& > *': {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
  },
  deleteButton: {
    color: theme.status.error
  }
}));

const styles = [
  { id: 'scrolling-ordered', text: 'Défilement dans l\'ordre' },
  { id: 'scrolling-random', text: 'Défilement aléatoire' },
];

const useConnect = () => {
  const dispatch = useDispatch();
  return {
    ...useSelector(state => ({
      selectedId: getSelectedId(state),
    })),
    ...useMemo(() => ({
      deleteSlideshow: id => dispatch(deleteSlideshow(id)),
      updateSlideshow: (slideshow, values) => dispatch(updateSlideshow(slideshow, values)),
      changeSelected: id => dispatch(changeSelected(id)),
    }), [dispatch])
  };
};

const ListItem = ({ slideshow, ...props }) => {
  const classes = useStyles();
  const { selectedId, deleteSlideshow, changeSelected } = useConnect();
  const id = slideshow._id;
  const selected = selectedId === id;
  const toggleSelect = () => changeSelected(selectedId === id ? null : id);
  const onDelete = () => deleteSlideshow(id);
  const onUpdate = (prop, value) => updateSlideshow(slideshow, { [prop]: value });

  return (
    <mui.ListItem {...props}>
      <mui.ExpansionPanel expanded={selected} onChange={toggleSelect} className={classes.panel}>
        <mui.ExpansionPanelSummary expandIcon={<mui.icons.ExpandMore />}>
          <StopPropagationContainer className={classes.summaryContainer}>
            <mui.Typography>Nom</mui.Typography>
            <DebouncedTextField value={slideshow.name} onChange={(value) => onUpdate('name', value)} />
            <mui.Typography>Style</mui.Typography>
            <ListSelector list={styles} value={slideshow.style} onChange={(value) => onUpdate('style', value)} />
            <mui.Button
              variant='contained'
              color='primary'
              startIcon={<icons.menu.Slideshows />}
              onClick={() => console.log('TODO: run slideshow', slideshow)}
            >
              Lancer
            </mui.Button>
          </StopPropagationContainer>
        </mui.ExpansionPanelSummary>
        <mui.ExpansionPanelDetails>
          {/* thumbnail du diaporama */}
          {/* selection des albums */}
          <mui.IconButton onClick={onDelete} className={classes.deleteButton}>
            <icons.actions.Delete />
          </mui.IconButton>
        </mui.ExpansionPanelDetails>
      </mui.ExpansionPanel>
    </mui.ListItem>
  );
};

ListItem.propTypes = {
  slideshow: PropTypes.object.isRequired
};

export default ListItem;

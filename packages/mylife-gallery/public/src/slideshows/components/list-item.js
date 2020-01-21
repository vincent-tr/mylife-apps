'use strict';

import { React, PropTypes, mui, useDispatch, useSelector, useMemo, StopPropagationContainer, DebouncedTextField, ListSelector } from 'mylife-tools-ui';
import icons from '../../common/icons';
import { deleteSlideshow, updateSlideshow, changeSelected } from '../actions';
import { getSelectedId } from '../selectors';
import Preview from './preview';

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
  editor: {
    width: 200
  },
  deleteButton: {
    color: theme.palette.getContrastText(theme.palette.error.main),
    backgroundColor: theme.palette.error.main,
    '&:hover': {
      backgroundColor: theme.palette.error.dark,
    }
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
  const { selectedId, deleteSlideshow, updateSlideshow, changeSelected } = useConnect();
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
            <mui.Grid container spacing={2}>
              <mui.Grid item xs={6}>
                <mui.Typography>Nom</mui.Typography>
              </mui.Grid>
              <mui.Grid item xs={6}>
                <DebouncedTextField value={slideshow.name} onChange={(value) => onUpdate('name', value)} className={classes.editor} />
              </mui.Grid>
              <mui.Grid item xs={6}>
                <mui.Typography>Style</mui.Typography>
              </mui.Grid>
              <mui.Grid item xs={6}>
                <ListSelector list={styles} value={slideshow.style} onChange={(value) => onUpdate('style', value)} className={classes.editor} />
              </mui.Grid>
              <mui.Grid item xs={12} justify='center' container>
                <mui.Button
                  variant='contained'
                  color='primary'
                  startIcon={<icons.menu.Slideshows />}
                  onClick={() => console.log('TODO: run slideshow', slideshow)}
                >
                  Lancer
                </mui.Button>
              </mui.Grid>
            </mui.Grid>
            <Preview slideshow={slideshow} />
          </StopPropagationContainer>
        </mui.ExpansionPanelSummary>
        <mui.ExpansionPanelDetails>
          {/* selection des albums */}
          <mui.Button
            variant='contained'
            className={classes.deleteButton}
            onClick={onDelete}
            startIcon={<icons.actions.Delete />}
          >
            {'Supprimer'}
          </mui.Button>
        </mui.ExpansionPanelDetails>
      </mui.ExpansionPanel>
    </mui.ListItem>
  );
};

ListItem.propTypes = {
  slideshow: PropTypes.object.isRequired
};

export default ListItem;

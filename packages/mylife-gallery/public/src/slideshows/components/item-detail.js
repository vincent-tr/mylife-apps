'use strict';

import { React, PropTypes, mui, useDispatch, useMemo, ListSelector, DebouncedSlider, DeleteButton } from 'mylife-tools-ui';
import icons from '../../common/icons';
import { updateSlideshow, deleteSlideshow } from '../actions';
import AlbumList from './album-list';
import AlbumAddButton from './album-add-button';
import { THUMBNAIL_SIZE } from '../../common/thumbnail';

const borderWidth = 1;

const useStyles = mui.makeStyles(theme => ({
  leftPanel: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    '& > *:first-child': {

    },
    '& > *:last-child': {
      alignSelf: 'flex-start'
    }
  },

  albumList: {
    width: '100%',
    overflowY: 'auto',
    height: '50vh',

    borderWidth: 1,
    borderColor: mui.colors.grey[300],
    borderStyle: 'solid',
  },
  buttonWrapper: {
    width: THUMBNAIL_SIZE + (theme.spacing(1) + borderWidth) * 2,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center'
  },
}));

const orders = [
  { id: 'ordered', text: 'Défilement dans l\'ordre' },
  { id: 'random', text: 'Défilement aléatoire' },
];

const transitions = [
  { id: 'none', text: 'Aucune' },
  { id: 'collapse', text: 'Réduction (collapse)' },
  { id: 'fade', text: 'Fondu au noir (fade)' },
  { id: 'grow', text: 'Agrandissement et fondu enchainée (grow)' },
  { id: 'slide', text: 'Défilement (slide)' },
  { id: 'zoom', text: 'Agrandissement (zoom)' },
];

const useConnect = () => {
  const dispatch = useDispatch();
  return useMemo(() => ({
    updateSlideshow: (slideshow, values) => dispatch(updateSlideshow(slideshow, values)),
    deleteSlideshow: id => dispatch(deleteSlideshow(id)),
  }), [dispatch]);
};

const ItemDetail = ({ slideshow }) => {
  const classes = useStyles();
  const { updateSlideshow, deleteSlideshow } = useConnect();
  const onUpdate = (prop, value) => updateSlideshow(slideshow, { [prop]: value });
  const onDelete = () => deleteSlideshow(slideshow._id);

  return (
    <mui.ExpansionPanelDetails>
      <mui.Grid container spacing={2}>

        <mui.Grid item xs={6} className={classes.leftPanel}>

          <mui.Grid spacing={4} container alignItems='center' alignContent='flex-start'>
            <mui.Grid item xs={6}>
              <mui.Typography>Ordonnancement</mui.Typography>
            </mui.Grid>
            <mui.Grid item xs={6}>
              <ListSelector list={orders} value={slideshow.order} onChange={(value) => onUpdate('order', value)} className={classes.editor} />
            </mui.Grid>
            <mui.Grid item xs={6}>
              <mui.Typography>Transition</mui.Typography>
            </mui.Grid>
            <mui.Grid item xs={6}>
              <ListSelector list={transitions} value={slideshow.transition} onChange={(value) => onUpdate('transition', value)} className={classes.editor} />
            </mui.Grid>
            <mui.Grid item xs={6}>
              <mui.Typography>Interval</mui.Typography>
            </mui.Grid>
            <mui.Grid item xs={6}>
              <DebouncedSlider min={0.1} step={0.1} max={30} valueLabelDisplay='auto' value={slideshow.interval} onChange={value => onUpdate('interval', value)} className={classes.editor} />
            </mui.Grid>
          </mui.Grid>

          <DeleteButton
            tooltip={'Supprimer le diaporama'}
            icon
            text='Supprimer'
            confirmText={`Etes-vous sûr de vouloir supprimer le diaporama '${slideshow.name}' ?`}
            onConfirmed={onDelete}
          />

        </mui.Grid>

        <mui.Grid item xs={6} container spacing={2} alignItems='center'>
          <mui.Grid item xs={6}>
            <mui.Typography>Albums</mui.Typography>
          </mui.Grid>
          <mui.Grid item xs={6} container justify='flex-end'>
            <AlbumAddButton slideshow={slideshow} />
          </mui.Grid>
          <mui.Grid item xs={12}>
            <AlbumList slideshow={slideshow} className={classes.albumList} />
          </mui.Grid>
        </mui.Grid>

      </mui.Grid>
    </mui.ExpansionPanelDetails>
  );
};

ItemDetail.propTypes = {
  slideshow: PropTypes.object.isRequired
};

export default ItemDetail;

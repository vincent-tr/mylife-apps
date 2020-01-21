'use strict';

import { React, PropTypes, mui, useDispatch, useMemo, StopPropagationContainer, DebouncedTextField, ListSelector } from 'mylife-tools-ui';
import icons from '../../common/icons';
import { updateSlideshow } from '../actions';
import Preview from './preview';

const useStyles = mui.makeStyles(theme => ({
  container: {
    width: '100%',
    maxWidth: 900,
    display: 'flex',
    alignItems: 'center',
    '& > *': {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
  },
  grid: {
    width: 650
  },
  editor: {
    width: 200
  }
}));

const styles = [
  { id: 'scrolling-ordered', text: 'Défilement dans l\'ordre' },
  { id: 'scrolling-random', text: 'Défilement aléatoire' },
];

const useConnect = () => {
  const dispatch = useDispatch();
  return useMemo(() => ({
    updateSlideshow: (slideshow, values) => dispatch(updateSlideshow(slideshow, values)),
  }), [dispatch]);
};

const ItemHeader = ({ slideshow }) => {
  const classes = useStyles();
  const { updateSlideshow } = useConnect();
  const onUpdate = (prop, value) => updateSlideshow(slideshow, { [prop]: value });

  return (
    <mui.ExpansionPanelSummary expandIcon={<mui.icons.ExpandMore />}>
      <StopPropagationContainer className={classes.container}>
        <mui.Grid container spacing={2} className={classes.grid}>
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
  );
};

ItemHeader.propTypes = {
  slideshow: PropTypes.object.isRequired
};

export default ItemHeader;

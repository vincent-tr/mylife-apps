'use strict';

import { React, PropTypes, mui, routing, useDispatch, useMemo, StopPropagationContainer, DebouncedTextField } from 'mylife-tools-ui';
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
  },
  runButton: {
    marginTop: theme.spacing(8)
  }
}));

const useConnect = () => {
  const dispatch = useDispatch();
  return useMemo(() => ({
    updateSlideshow: (slideshow, values) => dispatch(updateSlideshow(slideshow, values)),
  }), [dispatch]);
};

const ItemHeader = ({ slideshow }) => {
  const classes = useStyles();
  const { updateSlideshow } = useConnect();
  const { navigate } = routing.useRoutingConnect();
  const onUpdate = (prop, value) => updateSlideshow(slideshow, { [prop]: value });

  return (
    <mui.AccordionSummary expandIcon={<mui.icons.ExpandMore />}>
      <StopPropagationContainer className={classes.container}>
        <mui.Grid container spacing={2} className={classes.grid}>
          <mui.Grid item xs={6}>
            <mui.Typography>Nom</mui.Typography>
          </mui.Grid>
          <mui.Grid item xs={6}>
            <DebouncedTextField value={slideshow.name} onChange={(value) => onUpdate('name', value)} className={classes.editor} />
          </mui.Grid>
          <mui.Grid item xs={12} justifyContent='center' container>
            <mui.Button
              className={classes.runButton}
              variant='contained'
              color='primary'
              startIcon={<icons.menu.Slideshows />}
              onClick={() => navigate(`/slideshow/${slideshow._id}`)}
            >
              Lancer
            </mui.Button>
          </mui.Grid>
        </mui.Grid>
        <Preview slideshow={slideshow} />
      </StopPropagationContainer>
    </mui.AccordionSummary>
  );
};

ItemHeader.propTypes = {
  slideshow: PropTypes.object.isRequired
};

export default ItemHeader;

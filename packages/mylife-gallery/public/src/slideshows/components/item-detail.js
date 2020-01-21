'use strict';

import { React, PropTypes, mui, useDispatch, useMemo } from 'mylife-tools-ui';
import icons from '../../common/icons';
import { deleteSlideshow } from '../actions';
import AlbumList from './album-list';
import { THUMBNAIL_SIZE } from '../../common/thumbnail';

const borderWidth = 1;

const useStyles = mui.makeStyles(theme => ({
  container: {
    height: '50vh'
  },
  wrapper: {
    width: '100%',
    maxWidth: 900,
    display: 'flex',
    alignItems: 'flex-start',
    '& > *': {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
  },
  grid: {
    width: 650,
    height: '100%'
  },
  albumList: {
    flex: '1 1 auto',
    maxWidth: 400
  },
  buttonWrapper: {
    width: THUMBNAIL_SIZE + (theme.spacing(1) + borderWidth) * 2,
    display: 'flex',
    justifyContent: 'center'
  },
  deleteButton: {
    color: theme.palette.getContrastText(theme.palette.error.main),
    backgroundColor: theme.palette.error.main,
    '&:hover': {
      backgroundColor: theme.palette.error.dark,
    }
  },
}));

const useConnect = () => {
  const dispatch = useDispatch();
  return useMemo(() => ({
    deleteSlideshow: id => dispatch(deleteSlideshow(id)),
  }), [dispatch]);
};

const ItemDetail = ({ slideshow }) => {
  const classes = useStyles();
  const { deleteSlideshow } = useConnect();
  const id = slideshow._id;
  const onDelete = () => deleteSlideshow(id);

  return (
    <mui.ExpansionPanelDetails className={classes.container}>
      <div className={classes.wrapper}>
        <mui.Grid container spacing={2} className={classes.grid}>
          <mui.Grid item xs={6}>
            <mui.Typography>Albums</mui.Typography>
          </mui.Grid>
          <mui.Grid item xs={6} container>
            <AlbumList slideshow={slideshow} className={classes.albumList} />
          </mui.Grid>
        </mui.Grid>
        <div className={classes.buttonWrapper}>
          <mui.Button
            variant='contained'
            className={classes.deleteButton}
            onClick={onDelete}
            startIcon={<icons.actions.Delete />}
          >
            {'Supprimer'}
          </mui.Button>
        </div>
      </div>
    </mui.ExpansionPanelDetails>
  );
};

ItemDetail.propTypes = {
  slideshow: PropTypes.object.isRequired
};

export default ItemDetail;

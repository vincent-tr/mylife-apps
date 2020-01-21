'use strict';

import { React, PropTypes, mui, useDispatch, useMemo } from 'mylife-tools-ui';
import icons from '../../common/icons';
import { deleteSlideshow } from '../actions';
import AlbumList from './album-list';

const useStyles = mui.makeStyles(theme => ({
  deleteButton: {
    color: theme.palette.getContrastText(theme.palette.error.main),
    backgroundColor: theme.palette.error.main,
    '&:hover': {
      backgroundColor: theme.palette.error.dark,
    }
  }
}));

const useConnect = () => {
  const dispatch = useDispatch();
  return useMemo(() => ({
    deleteSlideshow: id => dispatch(deleteSlideshow(id)),
  }), [dispatch]);
};

const ItemDetail = ({ slideshow, ...props }) => {
  const classes = useStyles();
  const { deleteSlideshow } = useConnect();
  const id = slideshow._id;
  const onDelete = () => deleteSlideshow(id);

  return (
    <mui.ExpansionPanelDetails {...props}>
      <mui.Button
        variant='contained'
        className={classes.deleteButton}
        onClick={onDelete}
        startIcon={<icons.actions.Delete />}
      >
        {'Supprimer'}
      </mui.Button>
      <AlbumList slideshow={slideshow} />
    </mui.ExpansionPanelDetails>
  );
};

ItemDetail.propTypes = {
  slideshow: PropTypes.object.isRequired
};

export default ItemDetail;

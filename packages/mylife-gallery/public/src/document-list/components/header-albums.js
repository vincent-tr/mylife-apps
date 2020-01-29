'use strict';

import { React, PropTypes, mui, immutable, useState, useMemo } from 'mylife-tools-ui';
import { useAlbumView } from '../../common/album-view';
import icons from '../../common/icons';
import { renderObject } from '../../common/metadata-utils';

const useStyles = mui.makeStyles(theme => ({
  list: {
    width: 300,
    height: 180,
    overflow: 'auto',
    borderWidth: 1,
    borderColor: mui.colors.grey[300],
    borderStyle: 'solid',
  },
  buttonContainer: {
    '& > *:first-child': {
      marginLeft: theme.spacing(1),
    },
  },
  addButton: {
    color: theme.palette.success.main,
  },
  deleteButton: {
    color: theme.palette.error.main
  }
}));

const PopupAlbums = React.forwardRef(({ documents, onClose }, ref) => {
  const classes = useStyles();
  const { albums, albumView } = useAlbumView();
  const albumUsage = useMemo(() => getUsedAlbumIds(documents), [documents]);
  const albumIds = useMemo(() => new immutable.Set(albumUsage.keys()), [albumUsage]);

  const addableAlbums = useMemo(() => {
    // the same document cannot be added twice in an album
    return albums.filter(album => !albumIds.has(album._id));
  }, [albumIds, albums]);

  const onAdd = (album) => console.log('onAdd', album);
  const onDelete = (album) => console.log('onDelete', album);

  return (
    <mui.Paper ref={ref}>
      <mui.List className={classes.list} dense>
        {albumIds.map(albumId => {
          const album = albumView.get(albumId);
          if(!album) { // can happen if item view not ready
            return null;
          }

          const canAdd = albumUsage.get(albumId) < documents.length;

          return (
            <mui.ListItem key={album._id}>
              <mui.ListItemText primary={renderObject(album)} />
              <mui.ListItemSecondaryAction className={classes.buttonContainer}>
                {canAdd && (
                  <mui.Tooltip title={'Ajouter les documents à l\'album'}>
                    <mui.IconButton onClick={() => onAdd(album)} className={classes.addButton}>
                      <mui.icons.AddCircle />
                    </mui.IconButton>
                  </mui.Tooltip>
                )}
                <mui.Tooltip title={'Enlever les documents de l\'album'}>
                  <mui.IconButton onClick={() => onDelete(album)} className={classes.deleteButton}>
                    <mui.icons.Delete />
                  </mui.IconButton>
                </mui.Tooltip>
              </mui.ListItemSecondaryAction>
            </mui.ListItem>
          );
        }).toArray()}
      </mui.List>
    </mui.Paper>
  );
});

PopupAlbums.displayName = 'PopupAlbums';

PopupAlbums.propTypes = {
  documents: PropTypes.array.isRequired
};

const HeaderAlbums = ({ documents }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const handleOpen = e => setAnchorEl(e.target);
  const handleClose = () => setAnchorEl(null);

  const handleTooltipOpen = () => setTooltipOpen(true);
  const handleTooltipClose = () => setTooltipOpen(false);
  const isTooltipOpen = tooltipOpen && !anchorEl; // do not show tooltip when popup is shown


  return (
    <>
      <mui.Tooltip
        title={'Albums'}
        open={isTooltipOpen}
        onOpen={handleTooltipOpen}
        onClose={handleTooltipClose}
      >
        <mui.IconButton onClick={handleOpen}>
          <icons.menu.Album />
        </mui.IconButton>
      </mui.Tooltip>

      <mui.Popper open={!!anchorEl} anchorEl={anchorEl}>
        <mui.ClickAwayListener onClickAway={handleClose}>
          <PopupAlbums documents={documents} onClose={handleClose} />
        </mui.ClickAwayListener>
      </mui.Popper>
    </>
  );
};

HeaderAlbums.propTypes = {
  documents: PropTypes.array.isRequired
};

export default HeaderAlbums;

function getUsedAlbumIds(documents) {
  const map = new Map();
  for(const { info } of documents) {
    for(const { id } of info.albums) {
      let value = map.get(id) || 0;
      ++value;
      map.set(id, value);
    }
  }
  return new immutable.Map(map);
}

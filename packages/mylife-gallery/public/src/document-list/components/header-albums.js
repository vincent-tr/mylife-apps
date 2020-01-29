'use strict';

import { React, PropTypes, mui, immutable, useState, useEffect } from 'mylife-tools-ui';
import { useAlbumView } from '../../common/album-view';
import icons from '../../common/icons';
import { renderObject } from '../../common/metadata-utils';

const useStyles = mui.makeStyles(theme => ({
  paper: {
    display: 'flex',
    flexDirection: 'column'
  },
  title: {
    margin: theme.spacing(2),
  },
  list: {
    width: 300,
    height: 450,
    overflow: 'auto',

    borderTopWidth: 1,
    borderTopColor: mui.colors.grey[300],
    borderTopStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: mui.colors.grey[300],
    borderBottomStyle: 'solid',
  },
  addButton: {
    color: theme.palette.success.main
  }
}));

const PopupAlbums = React.forwardRef(({ documents, onClose }, ref) => {
  const classes = useStyles();
  const { albums } = useAlbumView();
  const [albumUsage, setAlbumUsage] = useState(new immutable.Map());
  const [initialAlbumUsage, setInitialAlbumUsage] = useState(new immutable.Map());

  useEffect(() => {
    const value = getInitialAlbumUsage(documents);
    setInitialAlbumUsage(value);
    setAlbumUsage(value);
  }, [documents]);

  const onUpdate = (album, value) => setAlbumUsage(albumUsage => (value ? albumUsage.set(album._id, new immutable.Set(documents)) : albumUsage.delete(album._id)));

  const onSave = () => {
    console.log('onSave');
    onClose();
  }

  return (
    <mui.Paper ref={ref} className={classes.paper}>
      <mui.Typography variant='h6' className={classes.title}>
        {'Albums'}
      </mui.Typography>

      <mui.List className={classes.list} dense>
        {albums.map(album => {
          const usage = (albumUsage.get(album._id) || new immutable.Set()).size;

          return (
            <mui.ListItem key={album._id}>
              <mui.ListItemIcon>
                <mui.Checkbox
                  edge='start'
                  color='primary'
                  checked={usage === documents.length}
                  indeterminate={usage > 0 && usage < documents.length}
                  onChange={e => onUpdate(album, e.target.checked)}
                  tabIndex={-1}
                  disableRipple
                />
              </mui.ListItemIcon>

              <mui.ListItemText primary={renderObject(album)} />
            </mui.ListItem>
          );
        })}
      </mui.List>

      <mui.List>
        <mui.ListItem>

          <mui.ListItemText primary={
            <mui.TextField fullWidth placeholder='Nouvel album...'/>
          } />

          <mui.ListItemSecondaryAction>
            <mui.IconButton edge='end' className={classes.addButton}>
              <mui.icons.AddCircle />
            </mui.IconButton>
          </mui.ListItemSecondaryAction>

        </mui.ListItem>

        <mui.ListItem button onClick={onSave}>
          <mui.ListItemText primary={'Appliquer'} />
        </mui.ListItem>
      </mui.List>

    </mui.Paper>
  );
});

PopupAlbums.displayName = 'PopupAlbums';

PopupAlbums.propTypes = {
  documents: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
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

function getInitialAlbumUsage(documents) {
  const albums = new Map();
  for(const { info, document } of documents) {
    for(const { id: albumId } of info.albums) {
      let documents = albums.get(albumId);
      if(!documents) {
        documents = new Set();
        albums.set(albumId, documents);
      }

      documents.add(document);
    }
  }
  const entries = Array.from(albums.entries());
  const setEntries = entries.map(([albumId, documents]) => [albumId, new immutable.Set(documents)]);
  return new immutable.Map(setEntries);
}

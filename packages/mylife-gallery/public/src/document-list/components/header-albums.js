'use strict';

import { React, PropTypes, mui, immutable, useState, useMemo } from 'mylife-tools-ui';
import { useAlbumView } from '../../common/album-view';
import icons from '../../common/icons';
import { renderObject } from '../../common/metadata-utils';

const useStyles = mui.makeStyles(theme => ({
  paper: {
    display: 'flex',
    flexDirection: 'column'
  },
  title: {
    margin: theme.spacing(1),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
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
  buttonContainer: {
    '& > *:first-child': {
      marginLeft: theme.spacing(1),
    },
  },
  addButton: {
    color: theme.palette.success.main
  },
  deleteButton: {
    color: theme.palette.error.main
  }
}));

const PopupAlbums = React.forwardRef(({ documents, onClose }, ref) => {
  const classes = useStyles();
  const { albums } = useAlbumView();
  const albumUsage = useMemo(() => getUsedAlbumIds(documents), [documents]);

  const onUpdate = (album, value) => console.log('onUpdate', album, value);
  const onSave = () => {
    console.log('onSave');
    onClose();
  }

  return (
    <mui.Paper ref={ref} className={classes.paper}>
      <div className={classes.title}>
        <mui.Typography variant='h6'>
          {'Albums'}
        </mui.Typography>

        <mui.IconButton className={classes.addButton}>
          <mui.icons.AddCircle />
        </mui.IconButton>
      </div>

      <mui.List className={classes.list} dense>
        {albums.map(album => {
          const usage = albumUsage.get(album._id);

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

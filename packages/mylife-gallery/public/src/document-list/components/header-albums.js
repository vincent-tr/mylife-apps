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
  },
  deleteButton: {
    color: theme.palette.error.main
  }
}));

const ENTER_KEY = 13;

const NewObject = ({ newTooltip, setNewObjects }) => {
  const classes = useStyles();
  const [name, setName] = useState('');

  const onValidate = () => {
    setNewObjects(newObjects => newObjects.push({ name, selected: true }));
    setName('');
  };

  const handleKeyDown = e => {
    if (e.keyCode === ENTER_KEY) {
      onValidate();
    }
  };

  return (
    <mui.ListItem>

      <mui.ListItemText primary={
        <mui.TextField
          fullWidth
          placeholder={newTooltip}
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      } />

      <mui.ListItemSecondaryAction>
        <mui.IconButton edge='end' className={classes.addButton} onClick={onValidate}>
          <mui.icons.AddCircle />
        </mui.IconButton>
      </mui.ListItemSecondaryAction>

    </mui.ListItem>
  );
};

NewObject.propTypes = {
  newTooltip: PropTypes.string.isRequired,
  setNewObjects: PropTypes.func.isRequired
};

const NewObjectItems = ({ newObjects, setNewObjects }) => {
  const classes = useStyles();
  const onNewUpdate = (index, selected) => setNewObjects(newObjects => newObjects.update(index, object => ({ ...object, selected })));
  const onNewDelete = (index) => setNewObjects(newObjects => newObjects.delete(index));

  return newObjects.map(({ name, selected }, index) => (
    <mui.ListItem key={index}>
      <mui.ListItemIcon>
        <mui.Checkbox
          edge='start'
          color='primary'
          checked={selected}
          onChange={e => onNewUpdate(index, e.target.checked)}
          tabIndex={-1}
          disableRipple
        />
      </mui.ListItemIcon>

      <mui.ListItemText primary={name} />

      <mui.ListItemSecondaryAction>
        <mui.IconButton edge='end' className={classes.deleteButton} onClick={() => onNewDelete(index)}>
          <mui.icons.Delete />
        </mui.IconButton>
      </mui.ListItemSecondaryAction>

    </mui.ListItem>
  ));
};

NewObjectItems.propTypes = {
  newObjects: PropTypes.object.isRequired,
  setNewObjects: PropTypes.func.isRequired,
};

const ObjectItems = ({ documents, objects, objectUsage, setObjectUsage }) => {
  const onUpdate = (object, value) => setObjectUsage(objectUsage => (value ? objectUsage.set(object._id, new immutable.Set(documents)) : objectUsage.delete(object._id)));

  return objects.map(object => {
    const usage = (objectUsage.get(object._id) || new immutable.Set()).size;

    return (
      <mui.ListItem key={object._id}>
        <mui.ListItemIcon>
          <mui.Checkbox
            edge='start'
            color='primary'
            checked={usage === documents.length}
            indeterminate={usage > 0 && usage < documents.length}
            onChange={e => onUpdate(object, e.target.checked)}
            tabIndex={-1}
            disableRipple
          />
        </mui.ListItemIcon>

        <mui.ListItemText primary={renderObject(object)} />
      </mui.ListItem>
    );
  });
};

const PopupObjects = React.forwardRef(({ title, newTooltip, documents, objects, onSave, getObjectUsage }, ref) => {
  const classes = useStyles();
  const [objectUsage, setObjectUsage] = useState(new immutable.Map());
  const [initialObjectUsage, setInitialObjectUsage] = useState(new immutable.Map());
  const [newObjects, setNewObjects] = useState(new immutable.List());

  useEffect(() => {
    const value = getObjectUsage(documents);
    setInitialObjectUsage(value);
    setObjectUsage(value);
  }, [documents, objects]);

  const handleSave = () => {
    onSave(newObjects, initialObjectUsage, objectUsage);
  };

  return (
    <mui.Paper ref={ref} className={classes.paper}>
      <mui.Typography variant='h6' className={classes.title}>
        {title}
      </mui.Typography>

      <mui.List className={classes.list} dense>
        <NewObjectItems newObjects={newObjects} setNewObjects={setNewObjects} />
        <ObjectItems documents={documents} objects={objects} objectUsage={objectUsage} setObjectUsage={setObjectUsage} />
      </mui.List>

      <mui.List>
        <NewObject newTooltip={newTooltip} setNewObjects={setNewObjects} />

        <mui.ListItem button onClick={handleSave}>
          <mui.ListItemText primary={'Appliquer'} />
        </mui.ListItem>
      </mui.List>

    </mui.Paper>
  );
});

PopupObjects.propTypes = {
  title: PropTypes.string.isRequired,
  newTooltip: PropTypes.string.isRequired,
  documents: PropTypes.array.isRequired,
  objects: PropTypes.array.isRequired,
  onSave: PropTypes.func.isRequired,
  getObjectUsage: PropTypes.func.isRequired,
};

PopupObjects.displayName = 'PopupObjects';

const HeaderObjects = ({ title, newTooltip, icon, documents, objects, onSave, getObjectUsage }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const handleOpen = e => setAnchorEl(e.target);
  const handleClose = () => setAnchorEl(null);

  const handleTooltipOpen = () => setTooltipOpen(true);
  const handleTooltipClose = () => setTooltipOpen(false);
  const isTooltipOpen = tooltipOpen && !anchorEl; // do not show tooltip when popup is shown

  const handleSave = (...args) => {
    onSave(...args);
    handleClose();
  };

  return (
    <>
      <mui.Tooltip
        title={title}
        open={isTooltipOpen}
        onOpen={handleTooltipOpen}
        onClose={handleTooltipClose}
      >
        <mui.IconButton onClick={handleOpen}>
          {icon}
        </mui.IconButton>
      </mui.Tooltip>

      <mui.Popper open={!!anchorEl} anchorEl={anchorEl}>
        <mui.ClickAwayListener onClickAway={handleClose}>
          <PopupObjects
            title={title}
            newTooltip={newTooltip}
            documents={documents}
            objects={objects}
            onSave={handleSave}
            getObjectUsage={getObjectUsage}
          />
        </mui.ClickAwayListener>
      </mui.Popper>
    </>
  );
};

HeaderObjects.propTypes = {
  title: PropTypes.string.isRequired,
  newTooltip: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  documents: PropTypes.array.isRequired,
  objects: PropTypes.array.isRequired,
  onSave: PropTypes.func.isRequired,
  getObjectUsage: PropTypes.func.isRequired,
};

const HeaderAlbums = ({ documents }) => {
  const { albums } = useAlbumView();
  const onSave = (newAlbums, initialAlbumUsage, albumUsage) => {
    console.log('onSave', newAlbums, initialAlbumUsage, albumUsage);
  };

  return (
    <HeaderObjects
      title={'Albums'}
      newTooltip={'Nouvel album...'}
      icon={<icons.menu.Album />}
      documents={documents}
      objects={albums}
      onSave={onSave}
      getObjectUsage={getInitialAlbumUsage}
    />
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

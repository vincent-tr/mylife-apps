'use strict';

import { React, PropTypes, mui, immutable, useState, useEffect } from 'mylife-tools-ui';
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
  deleteButton: {
    color: theme.palette.error.main
  }
}));

const NewObject = ({ newObject, setNewObjects }) => {
  const NewObjectComponent = newObject;
  const onNew = (values) => setNewObjects(newObjects => newObjects.push({ ...values, selected: true }));

  return (
    <NewObjectComponent onNew={onNew} />
  );
};

NewObject.propTypes = {
  newObject: PropTypes.elementType.isRequired,
  setNewObjects: PropTypes.func.isRequired
};

const NewObjectItems = ({ newObjects, setNewObjects, newObjectRenderer }) => {
  const classes = useStyles();
  const onNewUpdate = (index, selected) => setNewObjects(newObjects => newObjects.update(index, object => ({ ...object, selected })));
  const onNewDelete = (index) => setNewObjects(newObjects => newObjects.delete(index));

  return newObjects.map((object, index) => (
    <mui.ListItem key={index}>
      <mui.ListItemIcon>
        <mui.Checkbox
          edge='start'
          color='primary'
          checked={object.selected}
          onChange={e => onNewUpdate(index, e.target.checked)}
          tabIndex={-1}
          disableRipple
        />
      </mui.ListItemIcon>

      <mui.ListItemText primary={newObjectRenderer(object)} />

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
  newObjectRenderer: PropTypes.func.isRequired,
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

const PopupObjects = React.forwardRef(({ title, newObject, newObjectRenderer, documents, objects, onSave, getObjectUsage }, ref) => {
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
        <NewObjectItems newObjectRenderer={newObjectRenderer} newObjects={newObjects} setNewObjects={setNewObjects} />
        <ObjectItems documents={documents} objects={objects} objectUsage={objectUsage} setObjectUsage={setObjectUsage} />
      </mui.List>

      <mui.List>
        <NewObject newObject={newObject} setNewObjects={setNewObjects} />

        <mui.ListItem button onClick={handleSave}>
          <mui.ListItemText primary={'Appliquer'} />
        </mui.ListItem>
      </mui.List>

    </mui.Paper>
  );
});

PopupObjects.propTypes = {
  title: PropTypes.string.isRequired,
  newObject: PropTypes.elementType.isRequired,
  newObjectRenderer: PropTypes.func.isRequired,
  documents: PropTypes.array.isRequired,
  objects: PropTypes.array.isRequired,
  onSave: PropTypes.func.isRequired,
  getObjectUsage: PropTypes.func.isRequired,
};

PopupObjects.displayName = 'PopupObjects';

const HeaderObjects = ({ title, newObject, newObjectRenderer, icon, documents, objects, onSave, getObjectUsage }) => {
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
            newObject={newObject}
            newObjectRenderer={newObjectRenderer}
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
  newObject: PropTypes.elementType.isRequired,
  newObjectRenderer: PropTypes.func.isRequired,
  icon: PropTypes.node.isRequired,
  documents: PropTypes.array.isRequired,
  objects: PropTypes.array.isRequired,
  onSave: PropTypes.func.isRequired,
  getObjectUsage: PropTypes.func.isRequired,
};

export default HeaderObjects;

import { React, PropTypes, mui, immutable, useState, useEffect, useMemo, services } from 'mylife-tools-ui';

type FIXME_any = any;

const useStyles = mui.makeStyles(theme => ({
  menuButton: {
    margin: theme.spacing(1)
  },
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
  },
  breadcrumbsChip: {
    backgroundColor: mui.colors.grey[100],
    color: mui.colors.grey[700],
  },
  breadcrumbsSeparator: {
    marginLeft: theme.spacing(1),
    marginRight: 0
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
  const newSet = () => immutable.Set(documents.map(({ document }) => document));
  const onUpdate = (object, value) => setObjectUsage(objectUsage => (value ? objectUsage.set(object._id, newSet()) : objectUsage.delete(object._id)));

  return objects.map(object => {
    const usage = (objectUsage.get(object._id) || immutable.Set()).size;

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

        <mui.ListItemText primary={services.renderObject(object)} />
      </mui.ListItem>
    );
  });
};

interface PopupObjectsProps {
  title: string;
  newObject: React.ElementType;
  newObjectRenderer: (object) => React.ReactNode;
  documents: FIXME_any[];
  objects: FIXME_any[];
  onSave: (diff) => void;
  initialObjectUsage: FIXME_any;
}

const PopupObjects = React.forwardRef<HTMLDivElement, PopupObjectsProps>(({ title, newObject, newObjectRenderer, documents, objects, onSave, initialObjectUsage }, ref) => {
  const classes = useStyles();
  const [objectUsage, setObjectUsage] = useState(immutable.Map());
  const [newObjects, setNewObjects] = useState(immutable.List());

  useEffect(() => {
    setObjectUsage(initialObjectUsage);
  }, [initialObjectUsage]);

  const handleSave = () => onSave({ newObjects, ...computeObjectDiff(initialObjectUsage, objectUsage) });

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
  newObject: PropTypes.any.isRequired, // elementType
  newObjectRenderer: PropTypes.func.isRequired,
  documents: PropTypes.array.isRequired,
  objects: PropTypes.array.isRequired,
  onSave: PropTypes.func.isRequired,
  initialObjectUsage: PropTypes.object.isRequired,
};

const ObjectDisplay = ({ objects, initialObjectUsage }) => {
  const classes = useStyles();
  const selectedObjects = objects.filter(object => initialObjectUsage.get(object._id));
  return (
    <mui.Breadcrumbs
      separator=''
      maxItems={3}
      itemsAfterCollapse={0}
      itemsBeforeCollapse={2}
      classes={{ separator: classes.breadcrumbsSeparator }}
    >
      {selectedObjects.map(object => (
        <mui.Chip
          key={object._id}
          label={services.renderObject(object)}
          className={classes.breadcrumbsChip}
        />
      ))}
    </mui.Breadcrumbs>
  );
};

ObjectDisplay.propTypes = {
  objects: PropTypes.array.isRequired,
  initialObjectUsage: PropTypes.object.isRequired,
};

const HeaderObjects = ({ title, newObject, newObjectRenderer, icon, documents, objects, onSave, getObjectUsage }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const initialObjectUsage = useMemo(() => getObjectUsage(documents), [documents]);

  const handleOpen = e => setAnchorEl(e.target);
  const handleClose = () => setAnchorEl(null);

  const handleSave = (...args) => {
    onSave(...args);
    handleClose();
  };

  return (
    <>
      <mui.Typography>
        {title}
      </mui.Typography>

      <mui.IconButton
        className={classes.menuButton}
        size='small'
        onClick={handleOpen}
      >
        {icon}
      </mui.IconButton>

      <mui.Popper open={!!anchorEl} anchorEl={anchorEl}>
        <mui.ClickAwayListener onClickAway={handleClose}>
          <PopupObjects
            title={title}
            newObject={newObject}
            newObjectRenderer={newObjectRenderer}
            documents={documents}
            objects={objects}
            onSave={handleSave}
            initialObjectUsage={initialObjectUsage}
          />
        </mui.ClickAwayListener>
      </mui.Popper>

      <ObjectDisplay
        objects={objects}
        initialObjectUsage={initialObjectUsage}
      />
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

function computeObjectDiff(initialObjectUsage, currentObjectUsage) {
  const objectsAdd = new Map();
  const objectsRemove = new Map();

  for(const [id, initialDocuments] of initialObjectUsage.entries()) {
    const currentDocuments = currentObjectUsage.get(id);
    if(!currentDocuments) {
      objectsRemove.set(id, initialDocuments.toArray());
    }
  }

  for(const [id, currentDocuments] of currentObjectUsage.entries()) {
    const initialDocuments = initialObjectUsage.get(id);
    if(!initialDocuments) {
      objectsAdd.set(id, currentDocuments.toArray());
      continue;
    }

    // updates
    const addArray = [];
    const removeArray = [];
    for(const doc of initialDocuments) {
      if(!currentDocuments.has(doc)) {
        removeArray.push(doc);
      }
    }

    for(const doc of currentDocuments) {
      if(!initialDocuments.has(doc)) {
        addArray.push(doc);
      }
    }

    if(addArray.length > 0) {
      objectsAdd.set(id, addArray);
    }

    if(removeArray.length > 0) {
      objectsRemove.set(id, removeArray);
    }
  }

  return { objectsAdd, objectsRemove };
}

'use strict';

import { React, PropTypes, mui, services } from 'mylife-tools-ui';

const useStyles = mui.makeStyles(theme => ({
  list: {
    width: 300,
    height: 180,
    overflow: 'auto',
    borderWidth: 1,
    borderColor: mui.colors.grey[300],
    borderStyle: 'solid',
  },
  addButton: {
    marginLeft: theme.spacing(1),
    color: theme.palette.success.main
  },
  deleteButton: {
    marginLeft: theme.spacing(1),
    color: theme.palette.error.main
  }
}));

const useAddButtonStyles = mui.makeStyles(theme => ({
  listAddIcon: {
    marginRight: theme.spacing(1),
    color: theme.palette.success.main
  }
}));

const AddButton = ({ addTooltip, newTooltip, items, onAdd, onNew, ...props }) => {
  const classes = useAddButtonStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const onOpen = event => setAnchorEl(event.currentTarget);
  const onClose = () => setAnchorEl(null);

  const handleAdd = (item) => {
    onClose();
    onAdd(item);
  };

  return (
    <>
    <mui.Tooltip title={addTooltip}>
      <mui.IconButton {...props} onClick={onOpen}>
        <mui.icons.AddCircle />
      </mui.IconButton>
    </mui.Tooltip>
    <mui.Menu
      anchorEl={anchorEl}
      open={!!anchorEl}
      onClose={onClose}
    >
      <mui.MenuItem onClick={onNew}>
        <mui.icons.AddCircle className={classes.listAddIcon}/>
        {newTooltip}
      </mui.MenuItem>
      {items.map(item => (
        <mui.MenuItem key={item._id} onClick={() => handleAdd(item)}>{services.renderObject(item)}</mui.MenuItem>
      ))}
    </mui.Menu>
    </>
  );
};

AddButton.propTypes = {
  addTooltip: PropTypes.string.isRequired,
  newTooltip: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  onAdd: PropTypes.func.isRequired,
  onNew: PropTypes.func.isRequired
};

const DetailList = ({ title, addTooltip, newTooltip, deleteTooltip, onAdd, onNew, onDelete, items, addableItems }) => {
  const classes = useStyles();

  return (
    <mui.ListItem>
      <mui.ListItemText
        disableTypography
        primary={
          <mui.Typography>
            {title}
            <AddButton
              addTooltip={addTooltip}
              newTooltip={newTooltip}
              items={addableItems}
              onAdd={item => onAdd(item)}
              onNew={onNew}
              className={classes.addButton}
            />
          </mui.Typography>
        }
        secondary={
          <mui.List className={classes.list} dense>
            {items.map(item => {
              if(!item) { // can happen if item view not ready
                return null;
              }

              return (
                <mui.ListItem key={item._id}>
                  <mui.ListItemText primary={services.renderObject(item)} />
                  <mui.ListItemSecondaryAction>
                    <mui.Tooltip title={deleteTooltip}>
                      <mui.IconButton className={classes.deleteButton} onClick={() => onDelete(item)}>
                        <mui.icons.Delete />
                      </mui.IconButton>
                    </mui.Tooltip>
                  </mui.ListItemSecondaryAction>
                </mui.ListItem>
              );
            })}
          </mui.List>
        }
      />
    </mui.ListItem>
  );
};

DetailList.propTypes = {
  title: PropTypes.string.isRequired,
  addTooltip: PropTypes.string.isRequired,
  newTooltip: PropTypes.string.isRequired,
  deleteTooltip: PropTypes.string.isRequired,
  onAdd: PropTypes.func.isRequired,
  onNew: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
  addableItems: PropTypes.array.isRequired
};

export default DetailList;

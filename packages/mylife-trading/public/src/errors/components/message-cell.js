'use strict';

import { React, PropTypes, mui } from 'mylife-tools-ui';

const useStyles = mui.makeStyles(theme => ({
  noMaxWidth: {
    maxWidth: 'none',
  },
  iconContainer: {
    marginRight: theme.spacing(1)
  }
}));

const MessageCell = ({ rowData }) => {
  const classes = useStyles();
  const { message, stack } = rowData;

  return (
    <>
      <div className={classes.iconContainer}>
        <mui.Tooltip
          classes={{ tooltip: classes.noMaxWidth }}
          title={
            <mui.Typography component='div'>
              {stack}
            </mui.Typography>
          }
        >
          <mui.icons.Error color='error'/>
        </mui.Tooltip>
      </div>
      {message}
    </>
  );
};

MessageCell.propTypes = {
  rowData: PropTypes.object.isRequired
};

export default MessageCell;

'use strict';

import { React, PropTypes, mui } from 'mylife-tools-ui';

const useStyles = mui.makeStyles(theme => ({
  content: {
    paddingTop: 0
  }
}));

const CardBase = ({ title, description, actions, children, ...props }) => {
  const classes = useStyles();
  return (
    <mui.Card {...props}>
      <mui.CardHeader title={title} subheader={description} />
      {children && (
        <mui.CardContent className={classes.content}>
          {children}
        </mui.CardContent>
      )}
      {actions && (
        <mui.CardActions>
          {actions}
        </mui.CardActions>
      )}
    </mui.Card>
  );
};

CardBase.propTypes = {
  title: PropTypes.node,
  description: PropTypes.node,
  actions: PropTypes.oneOfType([ PropTypes.arrayOf(PropTypes.node), PropTypes.node ]),
  children: PropTypes.oneOfType([ PropTypes.arrayOf(PropTypes.node), PropTypes.node ]),
};

export default CardBase;

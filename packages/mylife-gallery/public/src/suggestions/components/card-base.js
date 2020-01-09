'use strict';

import { React, PropTypes, mui, clsx } from 'mylife-tools-ui';

const useStyles = mui.makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column'
  },
  contentPlaceholder: {
    flex: '1 1 0',
  },
  content: {
    paddingTop: 0
  }
});

const CardBase = ({ className, title, description, actions, children, ...props }) => {
  const classes = useStyles();
  return (
    <mui.Card className={clsx(className, classes.container)} {...props}>
      <mui.CardHeader title={title} subheader={description} />
      {children ? (
        <mui.CardContent className={classes.content}>
          {children}
        </mui.CardContent>
      ) : (
        <div className={classes.contentPlaceholder} />
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
  className: PropTypes.string,
  title: PropTypes.node,
  description: PropTypes.node,
  actions: PropTypes.oneOfType([ PropTypes.arrayOf(PropTypes.node), PropTypes.node ]),
  children: PropTypes.oneOfType([ PropTypes.arrayOf(PropTypes.node), PropTypes.node ]),
};

export default CardBase;

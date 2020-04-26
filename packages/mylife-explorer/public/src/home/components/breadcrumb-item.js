'use strict';

import { React, PropTypes, mui, useMemo, routing } from 'mylife-tools-ui';

const useStyles = mui.makeStyles(theme => ({
  titleLink: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
}));

const BreadcrumbItem = ({ path, index }) => {
  const classes = useStyles();
  const { navigate } = routing.useRoutingConnect();
  const { text, onClick } = useMemo(() => {
    const nodes = path.split('/');
    const url = '/' + nodes.slice(0, index + 1).join('/');
    const text = nodes[index];
    const onClick = e => {
      e.preventDefault();
      navigate(url);
    };

    return { text, onClick };
  }, [path, index]);
  
  return (
    <mui.Link color='inherit' component='button' variant='h6' className={classes.titleLink} onClick={onClick} noWrap>
      {text}
    </mui.Link>
  );
};

BreadcrumbItem.propTypes = {
  path: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
};

export default BreadcrumbItem;

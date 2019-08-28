'use strict';

import { React, mui, useMemo, useSelector, useDispatch, PropTypes, clsx } from 'mylife-tools-ui';
import { closeDetail } from '../../../actions/management';
import { getOperationDetail } from '../../../selectors/management';

const { makeStyles } = mui;

const useConnect = () => {
  const dispatch = useDispatch();
  return {
    ...useSelector(state => ({
      operation: getOperationDetail(state)
    })),
    ...useMemo(() => ({
      close : () => dispatch(closeDetail()),
    }), [dispatch])
  };
};

const useStyles = makeStyles({
  container: {
  }
});

const DetailContainer = ({ className }) => {
  const classes = useStyles();
  const { operation, close } = useConnect();

  return (
    <mui.Paper className={clsx(classes.container, className)}>
      {operation && operation._id}
      <mui.Button onClick={close}>
        Back
      </mui.Button>
    </mui.Paper>
  );
};

DetailContainer.propTypes = {
  className: PropTypes.string
};

export default DetailContainer;

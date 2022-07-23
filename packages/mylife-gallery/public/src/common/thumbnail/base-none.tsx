import { React, PropTypes, clsx } from 'mylife-tools-ui';
import { useCommonStyles } from './utils';
import icons from '../icons';

interface BaseNoneProps {
  className?: string;
}

const BaseNone: React.FunctionComponent<BaseNoneProps> = ({ className, ...props }) => {
  const classes = useCommonStyles();
  return (
    <div className={clsx(classes.container, className)} {...props}>
      <icons.documents.None className={classes.fallback} />
    </div>
  );
};

BaseNone.propTypes = {
  className: PropTypes.string
};

export default BaseNone;

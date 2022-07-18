import { React, PropTypes, mui, clsx } from 'mylife-tools-ui';

const useStyles = mui.makeStyles({
  toolbar: {
    backgroundColor: mui.colors.grey[300]
  }
});

interface ListFooterProps {
  text?: React.ReactNode;
  className?: string;
}

const ListFooter: React.FunctionComponent<ListFooterProps> = ({ text, className, ...props }) => {
  const classes = useStyles();
  return (
    <mui.Toolbar className={clsx(classes.toolbar, className)} {...props}>
      <mui.Typography>
        {text}
      </mui.Typography>
    </mui.Toolbar>
  );
};

ListFooter.propTypes = {
  className: PropTypes.string,
  text: PropTypes.string,
};

export default ListFooter;

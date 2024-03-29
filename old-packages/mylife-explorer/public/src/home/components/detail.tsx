'use strict';

import humanize from 'humanize';
import { React, PropTypes, mui, formatDate } from 'mylife-tools-ui';
import FileIcon from './file-icon';
import { getName } from './tools';

const Field = ({ name, value }) => (
  <mui.ListItem>
    <mui.ListItemText primary={name} secondary={value} />
  </mui.ListItem>
);

Field.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired
};

const useStyles = mui.makeStyles(theme => ({
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  titleText: {
    marginLeft: theme.spacing(2)
  }
}));

interface DetailProps {
  className?: string;
  data;
}

const Detail = React.forwardRef<HTMLUListElement, DetailProps>(({ data, ...props }, ref) => {
  const classes = useStyles();
  return (
    <mui.List ref={ref} {...props}>
      <mui.ListItem>
        <mui.ListItemText disableTypography primary={
          <div className={classes.titleContainer}>
            <FileIcon data={data} />
            <mui.Typography variant='h6' className={classes.titleText}>
              {getName(data)}
            </mui.Typography>
          </div>
        } />
      </mui.ListItem>

      <Field name='Taille' value={humanize.filesize(data.size)} />
      <Field name='Créé' value={formatTimestamp(data.ctime)} />
      <Field name='Modifié' value={formatTimestamp(data.mtime)} />
      <Field name='Accédé' value={formatTimestamp(data.atime)} />
    </mui.List>
  );
});

Detail.propTypes = {
  data: PropTypes.object.isRequired
};

export default Detail;

function formatTimestamp(value) {
  return formatDate(value, 'dd/MM/yyyy HH:mm:ss');
}
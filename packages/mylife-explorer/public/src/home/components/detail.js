'use strict';

import humanize from 'humanize';
import { React, PropTypes, mui, formatDate } from 'mylife-tools-ui';
import FileIcon from './file-icon';

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

const Detail = React.forwardRef(({ path, data, ...props }, ref) => {
  const classes = useStyles();
  return (
    <mui.List ref={ref} {...props}>
      <mui.ListItem>
        <mui.ListItemText disableTypography primary={
          <div className={classes.titleContainer}>
            <FileIcon data={data} />
            <mui.Typography variant='h6' className={classes.titleText}>
              {getName(path)}
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
  path: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired
};

export default Detail;

function getName(path) {
  const nodes = path.split('/');
  if(nodes.length) {
    return nodes[nodes.length - 1];
  }
  return '<Racine>';
}

function formatTimestamp(value) {
  return formatDate(value, 'dd/MM/yyyy HH:mm:ss');
}
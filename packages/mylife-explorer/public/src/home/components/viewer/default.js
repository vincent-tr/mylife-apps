'use strict';

import { React, PropTypes, mui, ListSelector, useState, clsx } from 'mylife-tools-ui';
import Text from './text';
import Image from './image';
import Video from './video';

const types = {
  text: Text,
  image: Image,
  video: Video,
};

const list = [
  { id: 'text', text: 'Texte' },
  { id: 'image', text: 'Image' },
  { id: 'video', text: 'Vidéo' },
];

const useStyles = mui.makeStyles(theme => ({
  container: {
    padding: theme.spacing(2)
  },
  selector: {
    minWidth: 160
  }
}));

const Default = ({ data, className, ...props }) => {
  const [type, setType] = useState(null);
  const classes = useStyles();

  if(data.type !== 'File') {
    return (
      <div className={clsx(className, classes.container)} {...props}>
        <mui.Typography>
          {`Aucun visualisateur pour afficher le fichier de type '${data.type}'`}
        </mui.Typography>
      </div>
    );
  }

  if(type) {
    console.log(type);
    const ViewerType = types[type];
    return (
      <ViewerType data={data} {...props} />
    );
  }

  return (
    <div className={clsx(className, classes.container)} {...props}>
      <mui.Typography>
        {`Aucun visualisateur pour afficher de fichier. Sélectionner un visualiseur`}
      </mui.Typography>
      <ListSelector list={list} value={type} onChange={setType} {...props} className={classes.selector} />
    </div>
  );
};

Default.propTypes = {
  className: PropTypes.string,
  data: PropTypes.object.isRequired
};

export default Default;

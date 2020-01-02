'use strict';

import { React, mui, useSelector, formatDate } from 'mylife-tools-ui';
import humanize from 'humanize';
import { getView } from '../selectors';

const useConnect = () => useSelector(state => ({
  stats : getView(state),
}));

const useStyles = mui.makeStyles({
  container: {
    marginTop: 20,
    marginRight: 20,
    marginLeft: 20,
    marginBottom: 20
  }
});

const Values = (props) => {
  const classes = useStyles();
  const { stats } = useConnect();
  const imageCount = statValue(stats, 'image-count');
  const imageFileSize = statValue(stats, 'image-file-size');
  const imageMediaSize = statValue(stats, 'image-media-size');
  const videoCount = statValue(stats, 'video-count');
  const videoFileSize = statValue(stats, 'video-file-size');
  const videoMediaSize = statValue(stats, 'video-media-size');
  const otherCount = statValue(stats, 'other-count');
  const otherFileSize = statValue(stats, 'other-file-size');
  const lastIntegration = statValue(stats, 'last-integration');

  return (
    <div {...props}>
      <div className={classes.container}>
        <mui.Typography>{`Nombre d'images : ${imageCount}, taille des fichiers : ${humanize.filesize(imageFileSize)}, taille des média : ${humanize.filesize(imageMediaSize)}`}</mui.Typography>
        <mui.Typography>{`Nombre de vidéos : ${videoCount}, taille des fichiers : ${humanize.filesize(videoFileSize)}, taille des média : ${humanize.filesize(videoMediaSize)}`}</mui.Typography>
        <mui.Typography>{`Nombre d'autres documents : ${otherCount}, taille des fichiers : ${humanize.filesize(otherFileSize)}`}</mui.Typography>
        <mui.Typography>{`Date d'intégration la plus récente : ${lastIntegration && formatDate(lastIntegration, 'dd/MM/yyyy')}`}</mui.Typography>
      </div>
    </div>
  );
};

export default Values;

function statValue(stats, code) {
  const stat = stats.find(stat => stat.code === code);
  if(!stat) {
    return null;
  }
  return stat.value;
}

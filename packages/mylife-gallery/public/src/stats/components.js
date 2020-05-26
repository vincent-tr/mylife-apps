'use strict';

import humanize from 'humanize';
import { React, mui, formatDate } from 'mylife-tools-ui';
import { useStatsView } from './behaviors';

const useStyles = mui.makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 auto',
    overflowY: 'auto',
    padding: 20,
  },
});

const Stats = () => {
  const classes = useStyles();
  const { view: stats } = useStatsView();

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
    <div className={classes.container}>
      <mui.Typography>{`Nombre d'images : ${imageCount}, taille des fichiers : ${humanize.filesize(imageFileSize)}, taille des média : ${humanize.filesize(imageMediaSize)}`}</mui.Typography>
      <mui.Typography>{`Nombre de vidéos : ${videoCount}, taille des fichiers : ${humanize.filesize(videoFileSize)}, taille des média : ${humanize.filesize(videoMediaSize)}`}</mui.Typography>
      <mui.Typography>{`Nombre d'autres documents : ${otherCount}, taille des fichiers : ${humanize.filesize(otherFileSize)}`}</mui.Typography>
      <mui.Typography>{`Date d'intégration la plus récente : ${lastIntegration && formatDate(lastIntegration, 'dd/MM/yyyy')}`}</mui.Typography>
    </div>
  );
};

export default Stats;

function statValue(stats, code) {
  const stat = stats.find(stat => stat.code === code);
  if(!stat) {
    return null;
  }
  return stat.value;
}

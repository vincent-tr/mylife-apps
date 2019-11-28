'use strict';

import { React, mui, useSelector, formatDate } from 'mylife-tools-ui';
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
  const videoCount = statValue(stats, 'video-count');
  const otherCount = statValue(stats, 'other-count');
  const lastIntegration = statValue(stats, 'last-integration');

  return (
    <div {...props}>
      <div className={classes.container}>
        <mui.Typography>{`Nombre d'images : ${imageCount}`}</mui.Typography>
        <mui.Typography>{`Nombre de vidéos : ${videoCount}`}</mui.Typography>
        <mui.Typography>{`Nombre d'autres documents : ${otherCount}`}</mui.Typography>
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

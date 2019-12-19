'use strict';

import { React, PropTypes, mui, formatDate as formatDateImpl } from 'mylife-tools-ui';
import humanize from 'humanize';

const SingleItem = ({ name, value }) => (
  <mui.ListItem>
    <mui.ListItemText primary={`${name} : ${value}`} />
  </mui.ListItem>
);


SingleItem.propTypes = {
  name: PropTypes.string,
  value: PropTypes.any
};

const ImageDetail = ({ open, document, info, ...props }) => {
  return (
    <mui.Slide direction='left' in={open} mountOnEnter unmountOnExit>
      <mui.List {...props}>
        <SingleItem name='Hash du fichier' value={document.hash} />
        <SingleItem name='Chemins du fichier' value={document.paths} />
        <SingleItem name={'Date d\'intégration'} value={formatDate(document.integrationDate)} />
        <SingleItem name='Taille du fichier' value={humanize.filesize(document.fileSize)} />
        <SingleItem name='Titre' value={document.caption} />
        <SingleItem name='Mots clés' value={document.keywords} />
        <SingleItem name='Hash de perception' value={document.perceptualHash} />
        <SingleItem name={'Modèle d\'appareil'} value={document.metadata.model} />
        <SingleItem name='Localisation' value={`TODO ${document.metadata.gpsLatitude} ${document.metadata.gpsLongitude}`} />
        <SingleItem name={'Dimensions de l\'image'} value={`${document.width} x ${document.height}`} />
        <SingleItem name='Date de prise de photo' value={formatDate(document.date)} />
        <SingleItem name='Personnes' value={JSON.stringify(document.persons)} />
        <SingleItem name='Albums' value={'TODO'} />
      </mui.List>
    </mui.Slide>
  );
};

ImageDetail.propTypes = {
  open: PropTypes.bool.isRequired,
  document: PropTypes.object.isRequired,
  info: PropTypes.object.isRequired,
};

export default ImageDetail;

function formatDate(date) {
  if(!date) {
    return '<indéfini>';
  }
  return formatDateImpl(date, 'dd/MM/yyyy');
}

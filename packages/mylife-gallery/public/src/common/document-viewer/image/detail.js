'use strict';

import { React, PropTypes, mui } from 'mylife-tools-ui';
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
        <SingleItem name={'Date d\'intégration'} value={document.integrationDate} />
        <SingleItem name='Taille du fichier' value={humanize.filesize(document.fileSize)} />
        <SingleItem name='Titre' value={document.caption} />
        <SingleItem name='Mots clés' value={document.keywords} />
        <SingleItem name='Hash de perception' value={document.perceptualHash} />
        <SingleItem name='Métadonnées' value={JSON.stringify(document.metadata)} />
        <SingleItem name={'Dimensions de l\'image'} value={`${document.width} x ${document.height}`} />
        <SingleItem name='Date de prise de photo' value={document.date} />
        <SingleItem name='Personnes' value={JSON.stringify(document.persons)} />
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

/*
document
{ id: 'hash', name: 'Hash', datatype: 'name', constraints: ['not-null', 'not-empty'] }, // file content hash
{ id: 'paths', name: 'Chemins', datatype: 'list:filesystem-item', constraints: ['not-null'], initial: [] },
{ id: 'integrationDate', name: 'Date d\'intégration', datatype: 'datetime', constraints: ['not-null'] },
{ id: 'fileSize', name: 'Taille du fichier', datatype: 'count', constraints: ['not-null'] }, // file content hash
{ id: 'caption', name: 'Légende', datatype: 'text' },
{ id: 'keywords', name: 'Mots clés', datatype: 'list:name', constraints: ['not-null'], initial: [] },
{ id: 'perceptualHash', name: 'Hash perception', datatype: 'name', constraints: ['not-null', 'not-empty'] },
{ id: 'thumbnail', name: 'Miniature', datatype: 'identifier' }, // we do not directly reference thumbnail because it is not loaded as store collection
{ id: 'mime', name: 'Type mime', datatype: 'name' },
{ id: 'metadata', name: 'Métadonnées', datatype: 'image-metadata' },
{ id: 'width', name: 'Largeur', datatype: 'count' },
{ id: 'height', name: 'Hauteur', datatype: 'count' },
{ id: 'date', name: 'Date de prise de photo', datatype: 'datetime' },
{ id: 'persons', name: 'Personnes', datatype: 'list:image-tag', constraints: ['not-null'], initial: [] },

+ albums
*/

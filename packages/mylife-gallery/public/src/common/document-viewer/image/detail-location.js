'use strict';

import { React, PropTypes, mui } from 'mylife-tools-ui';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet'

const position = [51.505, -0.09]

const DetailLocation = ({ location }) => {
  if(!location) {
    return null;
  }

  return (
    <mui.ListItem>
      <mui.ListItemText primary='Localisation'/>

      <Map center={position} zoom={13}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
        />
        <Marker position={position}>
          <Popup>A pretty CSS3 popup.<br />Easily customizable.</Popup>
        </Marker>
      </Map>

    </mui.ListItem>
  );
};

DetailLocation.propTypes = {
  location: PropTypes.object
};

export default DetailLocation;

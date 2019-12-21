'use strict';

import { React, PropTypes, mui } from 'mylife-tools-ui';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const DetailLocation = ({ location }) => {
  if(!location) {
    return null;
  }

  const position = [location.latitude, location.longitude];

  return (
    <mui.ListItem>
      <mui.ListItemText
        disableTypography
        primary={
          <mui.Typography>Localisation</mui.Typography>
        }
        secondary={
          <Map center={position} zoom={13} style={{ width: 300, height: 300 }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
            />
            <Marker position={position}>
              <Popup>A pretty CSS3 popup.<br />Easily customizable.</Popup>
            </Marker>
          </Map>
        } />
    </mui.ListItem>
  );
};

DetailLocation.propTypes = {
  location: PropTypes.object
};

export default DetailLocation;

'use strict';

import React       from 'react';
import PropTypes   from 'prop-types';

import GoogleMap from 'google-map-react';

import LocationIcon from '@material-ui/icons/GpsFixed';

const Marker = () => <LocationIcon />;

const Location = ({ latitude, longitude }) => (
  <div style={{ height: '15em', width: '15em' }}>
    <GoogleMap
      center={[latitude, longitude]}
      zoom={12}
    >
      <Marker
        lat={latitude}
        lng={longitude}
      />
    </GoogleMap>
  </div>
);

Location.propTypes = {
  latitude  : PropTypes.number.isRequired,
  longitude : PropTypes.number.isRequired,
};

export default Location;
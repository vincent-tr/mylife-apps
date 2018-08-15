'use strict';

import React       from 'react';
import PropTypes   from 'prop-types';

import GoogleMap from 'google-map-react';

const AnyReactComponent = ({ text }) => <div>{text}</div>;

const Location = ({ latitude, longitude }) => (
  <div style={{ height: '10vh', width: '100%' }}>
    <GoogleMap
      defaultCenter={[59.938043, 30.337157]}
      defaultZoom={9}
    >
      <div
        lat={59.955413}
        lng={30.337844}
        text={'Kreyser Avrora'}
      />
    </GoogleMap>
  </div>
);

Location.propTypes = {
  latitude  : PropTypes.number.isRequired,
  longitude : PropTypes.number.isRequired,
};

export default Location;
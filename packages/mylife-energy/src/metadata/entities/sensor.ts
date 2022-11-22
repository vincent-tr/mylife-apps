'use strict';

module.exports = {
  id: 'sensor',
  parent: 'base',
  name: 'Sensor',
  fields: [
    { id: 'sensorId', name: 'Sensor ID', datatype: 'name' },
    { id: 'deviceClass', name: 'Device class', datatype: 'name' },
    { id: 'stateClass', name: 'State class', datatype: 'name' },
    { id: 'unitOfMeasurement', name: 'Unit of measurement', datatype: 'name' },
    { id: 'accuracyDecimals', name: 'Accuracy decimals', datatype: 'amount' },
  ],
  display: obj => obj.sensorId
};

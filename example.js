const noble = require('noble-mac');
const XiaomiServiceReader = require('./index');

noble.on('stateChange', function (state) {
  if (state === 'poweredOn') {
    noble.startScanning([], true);
  } else {
    noble.stopScanning();
  }
});

noble.on('discover', function (peripheral) {
  const { id, address, addressType, connectable, rssi, advertisement } = peripheral;
  const { localName, serviceData, serviceUuids } = advertisement;

  if (serviceData) {
    const mjhtv1Sensor = serviceData
      .filter(service => service.uuid.toString('hex') === 'fe95')
      .shift();
    if (mjhtv1Sensor) {
      console.log({
        id,
        rssi,
        data: JSON.stringify(
          XiaomiServiceReader.readServiceData(mjhtv1Sensor.data)
        )
      });
    }
  }
});

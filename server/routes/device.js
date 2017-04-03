'use strict';

const device = require('../controllers/device.js');

module.exports = [
    { method: 'GET', path: '/api/devices/getall', config: { handler: device.getAll } },
    { method: 'GET', path: '/api/devices/searchdevices/{searchText?}', config: { handler: device.searchDevices } },
    { method: 'GET', path: '/api/devices/test/{id?}', config: { auth: false, handler: device.test } },
    { method: 'POST', path: '/api/devices/savedevice', config: { handler: device.saveDevice } },
    { method: 'POST', path: '/api/devices/updatedevice', config: { handler: device.updateDevice } },
    { method: 'POST', path: '/api/devices/deletedevice', config: { handler: device.deleteDevice } }
];
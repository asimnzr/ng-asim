'use strict';

const deviceType = require('../controllers/devicetype.js');

module.exports = [
    { method: 'GET', path: '/api/devicetypes/getall', config: { handler: deviceType.getAll } },
    { method: 'GET', path: '/api/devicetypes/test/{id?}', config: { auth: false, handler: deviceType.test } },
    { method: 'POST', path: '/api/devicetypes/savedevicetype', config: { handler: deviceType.saveDeviceType } },
    { method: 'POST', path: '/api/devicetypes/updatedevicetype', config: { handler: deviceType.updateDeviceType } },
    { method: 'POST', path: '/api/devicetypes/deletedevicetype', config: { handler: deviceType.deleteDeviceType } }
];
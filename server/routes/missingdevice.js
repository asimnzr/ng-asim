'use strict';

const missingDevice = require('../controllers/missingdevice.js');

module.exports = [
    { method: 'GET', path: '/api/missingdevices/getall', config: { handler: missingDevice.getAll } },
    { method: 'GET', path: '/api/missingdevices/test/{id?}', config: { auth: false, handler: missingDevice.test} },
    { method: 'POST', path: '/api/missingdevices/savemissingdevice', config: { handler: missingDevice.saveMissingDevice } },
    { method: 'POST', path: '/api/missingdevices/updatemissingdevice', config: { handler: missingDevice.updateMissingDevice } },
    { method: 'POST', path: '/api/missingdevices/deletemissingdevice', config: { handler: missingDevice.deleteMissingDevice } }
];
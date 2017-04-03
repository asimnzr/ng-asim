'use strict';

const receiveDvice = require('../controllers/receivedevice.js');

module.exports = [
    { method: 'GET', path: '/api/receivedevices/getall', config: { handler: receiveDvice.getAll } },
    { method: 'GET', path: '/api/receivedevices/getstatuses', config: { handler: receiveDvice.getStatuses } },
    { method: 'GET', path: '/api/receivedevices/test/{id?}', config: { auth: false, handler: receiveDvice.test } },
    { method: 'GET', path: '/api/receivedevices/getreceivedevicebyid', config: { handler: receiveDvice.getReceiveDeviceById } },
    { method: 'POST', path: '/api/receivedevices/savereceivedevice', config: { handler: receiveDvice.saveReceiveDevice } },
    { method: 'POST', path: '/api/receivedevices/updatereceivedevice', config: { handler: receiveDvice.updateReceiveDevice } },
    { method: 'POST', path: '/api/receivedevices/updatereceivedevicestatus', config: { handler: receiveDvice.updateReceiveDeviceStatus } },
    { method: 'POST', path: '/api/receivedevices/deletereceivedevice', config: { handler: receiveDvice.deleteReceiveDevice } }
];